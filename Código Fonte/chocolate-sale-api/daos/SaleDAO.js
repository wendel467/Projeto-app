// daos/SaleDAO.js
const db = require('../db_config');
const StockDAO = require('./StockDAO');

class SaleDAO {
  createSaleOrder(clientId, sellerId, itemsArray, callback) {
    db.getClient((errClient, client, release) => {
      if (errClient) {
        console.error('Erro ao obter cliente do pool:', errClient);
        return callback(errClient);
      }

      client.query('BEGIN', (errBegin) => {
        if (errBegin) {
          console.error('Erro ao iniciar transação BEGIN:', errBegin);
          release();
          return callback(errBegin);
        }

        // 1. Criar o registro principal do pedido (sales_orders)
        const saleOrderSql = `
          INSERT INTO sales_orders (client_id, seller_id, status)
          VALUES ($1, $2, 'Pending')
          RETURNING order_id, order_date, status;
        `;
        const saleOrderParams = [clientId, sellerId];

        client.query(saleOrderSql, saleOrderParams, (errOrderHeader, saleOrderResult) => {
          if (errOrderHeader) {
            console.error('Erro ao inserir sales_orders:', errOrderHeader);
            return client.query('ROLLBACK', (errRollback) => {
              release();
              if (errRollback) return callback(errRollback);
              callback(errOrderHeader);
            });
          }

          const newOrderHeader = saleOrderResult.rows[0];
          const orderId = newOrderHeader.order_id;
          let calculatedTotalAmount = 0;
          const createdOrderItems = [];
          let currentItemIndex = 0;

          // Função para processar cada item do pedido sequencialmente usando callbacks
          function processItem() {
            if (currentItemIndex >= itemsArray.length) {
              // Todos os itens processados, atualizar total e comitar
              const updateOrderTotalSql = `
                UPDATE sales_orders
                SET total_amount = $1, status = 'Completed'
                WHERE order_id = $2
                RETURNING *;
              `;
              client.query(updateOrderTotalSql, [calculatedTotalAmount, orderId], (errUpdateTotal, finalOrderResult) => {
                if (errUpdateTotal) {
                  console.error('Erro ao atualizar total_amount em sales_orders:', errUpdateTotal);
                  return client.query('ROLLBACK', (errRollback) => {
                    release();
                    if (errRollback) return callback(errRollback);
                    callback(errUpdateTotal);
                  });
                }

                client.query('COMMIT', (errCommit) => {
                  release();
                  if (errCommit) {
                    console.error('Erro ao COMMITAR transação:', errCommit);
                    // Nota: se o COMMIT falhar, o rollback pode não ser possível ou necessário,
                    // pois a transação já pode ter sido finalizada pelo SGBD com erro.
                    return callback(errCommit);
                  }
                  callback(null, { ...finalOrderResult.rows[0], items: createdOrderItems });
                });
              });
              return; // Fim do processamento de itens
            }

            const item = itemsArray[currentItemIndex];
            // a. Verificar o estoque e obter o preço do produto
            const productCheckSql = "SELECT price, current_stock, name FROM products WHERE product_id = $1 FOR UPDATE;";
            client.query(productCheckSql, [item.productId], (errProductCheck, productCheckResult) => {
              if (errProductCheck) {
                console.error(`Erro ao verificar produto ID ${item.productId}:`, errProductCheck);
                return client.query('ROLLBACK', (errRollback) => {
                  release();
                  if (errRollback) return callback(errRollback);
                  callback(errProductCheck);
                });
              }

              if (productCheckResult.rows.length === 0) {
                const productNotFoundErr = new Error(`Produto com ID ${item.productId} não encontrado.`);
                return client.query('ROLLBACK', (errRollback) => {
                  release();
                  if (errRollback) return callback(errRollback);
                  callback(productNotFoundErr);
                });
              }
              const product = productCheckResult.rows[0];

              if (product.current_stock < item.quantity) {
                const insufficientStockErr = new Error(`Estoque insuficiente para o produto '${product.name}' (ID: ${item.productId}). Disponível: ${product.current_stock}, Pedido: ${item.quantity}.`);
                return client.query('ROLLBACK', (errRollback) => {
                  release();
                  if (errRollback) return callback(errRollback);
                  callback(insufficientStockErr);
                });
              }

              const unitPrice = parseFloat(product.price);
              calculatedTotalAmount += unitPrice * item.quantity;

              // b. Inserir o item do pedido (order_items)
              const orderItemSql = `
                INSERT INTO order_items (order_id, product_id, quantity, unit_price)
                VALUES ($1, $2, $3, $4)
                RETURNING *;
              `;
              const orderItemParams = [orderId, item.productId, item.quantity, unitPrice];
              client.query(orderItemSql, orderItemParams, (errOrderItem, orderItemResult) => {
                if (errOrderItem) {
                  console.error('Erro ao inserir order_items:', errOrderItem);
                  return client.query('ROLLBACK', (errRollback) => {
                    release();
                    if (errRollback) return callback(errRollback);
                    callback(errOrderItem);
                  });
                }
                createdOrderItems.push(orderItemResult.rows[0]);

                // c. Atualizar o estoque e registrar o movimento
                StockDAO.updateStockAndLogMovement(
                  client, item.productId, -item.quantity, 'sale', orderId, `Venda item para pedido ${orderId}`,
                  (errStockUpdate) => {
                    if (errStockUpdate) {
                      console.error('Erro em updateStockAndLogMovement durante a venda:', errStockUpdate);
                      return client.query('ROLLBACK', (errRollback) => {
                        release();
                        if (errRollback) return callback(errRollback);
                        callback(errStockUpdate);
                      });
                    }
                    currentItemIndex++; // Próximo item
                    processItem();    // Chamada recursiva
                  }
                );
              });
            });
          }
          processItem(); // Iniciar o processamento do primeiro item
        });
      });
    });
  }

  cancelSaleOrder(orderId, callback) {
    db.getClient((errClient, client, release) => {
      if (errClient) {
        console.error('Erro ao obter cliente do pool:', errClient);
        return callback(errClient);
      }

      client.query('BEGIN', (errBegin) => {
        if (errBegin) {
          console.error('Erro ao iniciar transação BEGIN para cancelamento:', errBegin);
          release();
          return callback(errBegin);
        }

        // 1. Verificar se o pedido existe e seu status
        const orderCheckSql = "SELECT status FROM sales_orders WHERE order_id = $1 FOR UPDATE;";
        client.query(orderCheckSql, [orderId], (errOrderCheck, orderCheckResult) => {
          if (errOrderCheck) {
            console.error(`Erro ao verificar pedido ID ${orderId} para cancelamento:`, errOrderCheck);
            return client.query('ROLLBACK', (errRollback) => {
              release();
              if (errRollback) return callback(errRollback);
              callback(errOrderCheck);
            });
          }

          if (orderCheckResult.rows.length === 0) {
            const orderNotFoundErr = new Error(`Pedido com ID ${orderId} não encontrado para cancelamento.`);
            return client.query('ROLLBACK', (errRollback) => {
              release();
              if (errRollback) return callback(errRollback);
              callback(orderNotFoundErr);
            });
          }
          const currentOrder = orderCheckResult.rows[0];
          if (currentOrder.status === 'Cancelled') {
            const alreadyCancelledErr = new Error(`Pedido ${orderId} já está cancelado.`);
            // Não é um erro de transação, então não necessariamente um rollback, mas a operação não pode prosseguir.
            release(); // Libera o cliente pois a transação não será modificada.
            return callback(alreadyCancelledErr);
          }
           if (currentOrder.status !== 'Completed' && currentOrder.status !== 'Pending') {
             const cannotCancelErr = new Error(`Pedido ${orderId} não pode ser cancelado pois está no status '${currentOrder.status}'.`);
             release();
             return callback(cannotCancelErr);
           }


          // 2. Obter os itens do pedido para reposição de estoque
          const itemsSql = "SELECT product_id, quantity FROM order_items WHERE order_id = $1;";
          client.query(itemsSql, [orderId], (errItems, itemsResult) => {
            if (errItems) {
              console.error(`Erro ao buscar itens do pedido ${orderId} para cancelamento:`, errItems);
              return client.query('ROLLBACK', (errRollback) => {
                release();
                if (errRollback) return callback(errRollback);
                callback(errItems);
              });
            }
            const orderItemsToRestock = itemsResult.rows;
            let currentItemIndex = 0;

            function restockItem() {
              if (currentItemIndex >= orderItemsToRestock.length) {
                // Todos os itens repostos, atualizar status do pedido e comitar
                const updateOrderStatusSql = `
                  UPDATE sales_orders
                  SET status = 'Cancelled'
                  WHERE order_id = $1
                  RETURNING *;
                `;
                client.query(updateOrderStatusSql, [orderId], (errUpdateStatus, cancelledOrderResult) => {
                  if (errUpdateStatus) {
                    console.error('Erro ao atualizar status para Cancelled:', errUpdateStatus);
                    return client.query('ROLLBACK', (errRollback) => {
                      release();
                      if (errRollback) return callback(errRollback);
                      callback(errUpdateStatus);
                    });
                  }

                  client.query('COMMIT', (errCommit) => {
                    release();
                    if (errCommit) {
                       console.error('Erro ao COMMITAR transação de cancelamento:', errCommit);
                       return callback(errCommit);
                    }
                    callback(null, { ...cancelledOrderResult.rows[0], items_restocked_info: orderItemsToRestock });
                  });
                });
                return; // Fim do processamento de itens para reposição
              }

              const itemToRestock = orderItemsToRestock[currentItemIndex];
              StockDAO.updateStockAndLogMovement(
                client, itemToRestock.product_id, itemToRestock.quantity, // Quantidade positiva para reposição
                'cancellation_restock', orderId, `Cancelamento/Reposição item do pedido ${orderId}`,
                (errStockUpdate) => {
                  if (errStockUpdate) {
                    console.error('Erro em updateStockAndLogMovement durante cancelamento:', errStockUpdate);
                    return client.query('ROLLBACK', (errRollback) => {
                      release();
                      if (errRollback) return callback(errRollback);
                      callback(errStockUpdate);
                    });
                  }
                  currentItemIndex++;
                  restockItem(); // Chamada recursiva
                }
              );
            }
            if (orderItemsToRestock.length === 0 && currentOrder.status === 'Pending') {
                 // Pedido sem itens (ex: criado e não finalizado) pode ser simplesmente cancelado
                 const updateOrderStatusSql = `
                   UPDATE sales_orders
                   SET status = 'Cancelled'
                   WHERE order_id = $1
                   RETURNING *;
                 `;
                 client.query(updateOrderStatusSql, [orderId], (errUpdateStatus, cancelledOrderResult) => {
                     if (errUpdateStatus) {
                         console.error('Erro ao atualizar status para Cancelled (pedido pendente sem itens):', errUpdateStatus);
                         return client.query('ROLLBACK', (errRollback) => {
                             release();
                             if (errRollback) return callback(errRollback);
                             callback(errUpdateStatus);
                         });
                     }
                     client.query('COMMIT', (errCommit) => {
                         release();
                         if (errCommit) {
                             console.error('Erro ao COMMITAR transação de cancelamento (pedido pendente sem itens):', errCommit);
                             return callback(errCommit);
                         }
                         callback(null, { ...cancelledOrderResult.rows[0], items_restocked_info: [] });
                     });
                 });
            } else if (orderItemsToRestock.length > 0) {
                restockItem(); // Iniciar a reposição do primeiro item
            } else { // Pedido "Completed" sem itens (estranho, mas cobrir o caso)
                const updateOrderStatusSql = `
                  UPDATE sales_orders
                  SET status = 'Cancelled'
                  WHERE order_id = $1
                  RETURNING *;
                `;
                client.query(updateOrderStatusSql, [orderId], (errUpdateStatus, cancelledOrderResult) => {
                     if (errUpdateStatus) { /* ... rollback ... */ }
                     client.query('COMMIT', (errCommit) => {
                         /* ... release ... */
                         callback(null, { ...cancelledOrderResult.rows[0], items_restocked_info: [] });
                     });
                });
            }
          });
        });
      });
    });
  }

  findOrderById(orderId, callback) {
    const sql = `
        SELECT so.*,
               (SELECT json_agg(json_build_object('product_id', oi.product_id, 'product_name', p.name, 'quantity', oi.quantity, 'unit_price', oi.unit_price))
                FROM order_items oi
                JOIN products p ON oi.product_id = p.product_id
                WHERE oi.order_id = so.order_id) as items
        FROM sales_orders so
        WHERE so.order_id = $1;
    `;
    db.query(sql, [orderId], (err, result) => {
        if (err) return callback(err);
        callback(null, result.rows[0]);
    });
  }

  findAllOrders(callback) {
    const sql = `
        SELECT so.*,
               c.name as client_name,
               s.name as seller_name,
               (SELECT json_agg(json_build_object('product_name', p.name, 'quantity', oi.quantity))
                FROM order_items oi
                JOIN products p ON oi.product_id = p.product_id
                WHERE oi.order_id = so.order_id) as items_summary
        FROM sales_orders so
        LEFT JOIN clients c ON so.client_id = c.client_id
        LEFT JOIN sellers s ON so.seller_id = s.seller_id
        ORDER BY so.order_date DESC;
    `;
    db.query(sql, [], (err, result) => {
        if (err) return callback(err);
        callback(null, result.rows);
    });
  }
}

module.exports = new SaleDAO();