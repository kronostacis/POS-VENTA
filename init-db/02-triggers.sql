-- TRIGGERS PARA POS-VENTA

DELIMITER //

CREATE TRIGGER actualizar_stock_producto
AFTER INSERT ON Lote_productos
FOR EACH ROW
BEGIN
    UPDATE Productos p
    JOIN (
        SELECT Id_producto, SUM(Stock) AS NuevoStock
        FROM Lote_productos
        WHERE Id_producto = NEW.Id_producto
        GROUP BY Id_producto
    ) AS SumarStock
    ON p.Id_producto = SumarStock.Id_producto
    SET p.Stock = SumarStock.NuevoStock
    WHERE p.Id_producto = NEW.Id_producto;
END;
//

CREATE TRIGGER actualizar_stock_producto_despues_delete
AFTER DELETE ON Lote_productos
FOR EACH ROW
BEGIN
    UPDATE Productos p
    LEFT JOIN (
        SELECT Id_producto, IFNULL(SUM(Stock), 0) AS NuevoStock
        FROM Lote_productos
        WHERE Id_producto = OLD.Id_producto
        GROUP BY Id_producto
    ) AS SumarStock
    ON p.Id_producto = SumarStock.Id_producto
    SET p.Stock = SumarStock.NuevoStock
    WHERE p.Id_producto = OLD.Id_producto;
END;
//

CREATE TRIGGER actualizar_stock_producto_despues_update
AFTER UPDATE ON Lote_productos
FOR EACH ROW
BEGIN
    IF OLD.Stock <> NEW.Stock OR OLD.Id_producto <> NEW.Id_producto THEN
        -- Actualizar el stock del NUEVO producto
        UPDATE Productos p
        JOIN (
            SELECT Id_producto, SUM(Stock) AS NuevoStock
            FROM Lote_productos
            WHERE Id_producto = NEW.Id_producto
            GROUP BY Id_producto
        ) AS SumarStock
        ON p.Id_producto = SumarStock.Id_producto
        SET p.Stock = SumarStock.NuevoStock
        WHERE p.Id_producto = NEW.Id_producto;

        -- Si cambió el producto, actualizar también el ANTIGUO producto
        IF OLD.Id_producto <> NEW.Id_producto THEN
            UPDATE Productos p
            LEFT JOIN (
                SELECT Id_producto, IFNULL(SUM(Stock), 0) AS NuevoStock
                FROM Lote_productos
                WHERE Id_producto = OLD.Id_producto
                GROUP BY Id_producto
            ) AS SumarStock
            ON p.Id_producto = SumarStock.Id_producto
            SET p.Stock = IFNULL(SumarStock.NuevoStock, 0)
            WHERE p.Id_producto = OLD.Id_producto;
        END IF;
    END IF;
END;
//

CREATE TRIGGER eliminar_detalle_y_venta
BEFORE DELETE ON Ventas
FOR EACH ROW
BEGIN
    DELETE FROM Detalle_ventas_productos
    WHERE Id_venta = OLD.Id_venta;
END;
//

DELIMITER ;
