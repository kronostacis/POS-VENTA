-- BORRADO DE TABLAS (ORDEN CORRECTO)
DROP TABLE IF EXISTS `Detalle_ventas_productos`;
DROP TABLE IF EXISTS `Lote_productos`;
DROP TABLE IF EXISTS `Ventas`;
DROP TABLE IF EXISTS `Estado_ventas`;
DROP TABLE IF EXISTS `Productos`;
DROP TABLE IF EXISTS `Medio_pagos`;
DROP TABLE IF EXISTS `Estado_medios_pago`;
DROP TABLE IF EXISTS `Usuarios`;
DROP TABLE IF EXISTS `Estado_usuarios`;
DROP TABLE IF EXISTS `Cargos`;
DROP TABLE IF EXISTS `Operacion`;
DROP TABLE IF EXISTS `Tipo_operacion`;
DROP TABLE IF EXISTS `Cuentas`;

-- TABLAS
CREATE TABLE `Cargos` (
    `Id_cargo` INT NOT NULL,
    `Nombre_cargo` VARCHAR(255),
    PRIMARY KEY (`Id_cargo`)
);

CREATE TABLE `Estado_usuarios` (
    `Id_estado_usuario` INT NOT NULL,
    `Nombre_estado_usuario` VARCHAR(255),
    PRIMARY KEY (`Id_estado_usuario`)
);

CREATE TABLE `Estado_medios_pago` (
    `Id_estado_medio_pago` INT NOT NULL,
    `Nombre_estado_medio_pago` VARCHAR(255),
    PRIMARY KEY (`Id_estado_medio_pago`)
);

CREATE TABLE `Estado_ventas` (
    `Id_estado_venta` INT NOT NULL AUTO_INCREMENT,
    `Nombre_estado_venta` VARCHAR(255),
    PRIMARY KEY (`Id_estado_venta`)
);

CREATE TABLE `Tipo_operacion` (
    `Id_tipo_operacion` INT NOT NULL,
    `Nombre_operacion` VARCHAR(255),
    PRIMARY KEY (`Id_tipo_operacion`)
);

CREATE TABLE `Cuentas` (
    `Id_cuenta` INT NOT NULL,
    `Nombre_cuenta` VARCHAR(255),
    `Monto` INT,
    PRIMARY KEY (`Id_cuenta`)
);

CREATE TABLE `Operacion` (
    `Id_operacion` INT NOT NULL,
    `Monto` INT,
    `Fecha_operacion` DATE,
    `Id_tipo_operacion` INT,
    `Id_cuenta` INT,
    `Descripcion` VARCHAR(255),
    PRIMARY KEY (`Id_operacion`),
    FOREIGN KEY (`Id_tipo_operacion`) REFERENCES `Tipo_operacion`(`Id_tipo_operacion`),
    FOREIGN KEY (`Id_cuenta`) REFERENCES `Cuentas`(`Id_cuenta`)
);

CREATE TABLE `Usuarios` (
    `Id_usuario` INT NOT NULL,
    `Nombre` VARCHAR(60),
    `Apellido_1` VARCHAR(80),
    `Apellido_2` VARCHAR(80),
    `Contrasena` VARCHAR(255),
    `Cargo` INT,
    `Id_estado_usuario` INT DEFAULT 1,
    PRIMARY KEY (`Id_usuario`),
    FOREIGN KEY (`Id_estado_usuario`) REFERENCES `Estado_usuarios`(`Id_estado_usuario`),
    FOREIGN KEY (`Cargo`) REFERENCES `Cargos`(`Id_cargo`)
);

CREATE TABLE `Medio_pagos` (
    `Id_pago` INT NOT NULL AUTO_INCREMENT,
    `Nombre_pago` VARCHAR(255),
    `Id_estado_medio_pago` INT DEFAULT 1,
    PRIMARY KEY (`Id_pago`),
    FOREIGN KEY (`Id_estado_medio_pago`) REFERENCES `Estado_medios_pago`(`Id_estado_medio_pago`)
);

CREATE TABLE `Productos` (
    `Id_producto` INT NOT NULL,
    `Nombre` VARCHAR(255) UNIQUE,
    `Precio_venta` DECIMAL(10,2),
    `Stock` INT,
    PRIMARY KEY (`Id_producto`)
);

CREATE TABLE `Ventas` (
    `Id_venta` INT NOT NULL,
    `Id_pago` INT,
    `Total_venta` DECIMAL(10,2),
    `Fecha_venta` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `Id_usuario` INT NOT NULL,
    `Utilidad_total` DECIMAL(10,2),
    `Id_estado_venta` INT,
    PRIMARY KEY (`Id_venta`),
    FOREIGN KEY (`Id_estado_venta`) REFERENCES `Estado_ventas`(`Id_estado_venta`),
    FOREIGN KEY (`Id_pago`) REFERENCES `Medio_pagos`(`Id_pago`),
    FOREIGN KEY (`Id_usuario`) REFERENCES `Usuarios`(`Id_usuario`)
);
    
CREATE TABLE `Lote_productos` (
    `Id_lote` INT NOT NULL AUTO_INCREMENT,
    `Id_producto` INT,
    `Precio_compra` DECIMAL(10,2),
    `Cantidad` INT,
    `Stock` INT,
    `Fecha` DATE,
    PRIMARY KEY (`Id_lote`),
    FOREIGN KEY (`Id_producto`) REFERENCES `Productos`(`Id_producto`)
);

CREATE TABLE `Detalle_ventas_productos` (
    `Id_venta` INT,
    `Id_producto` INT,
    `Cantidad` INT,
    `Precio_total` DECIMAL(10,2),
    PRIMARY KEY (`Id_venta`, `Id_producto`),
    FOREIGN KEY (`Id_producto`) REFERENCES `Productos`(`Id_producto`),
    FOREIGN KEY (`Id_venta`) REFERENCES `Ventas`(`Id_venta`)
);

-- DATOS INICIALES
INSERT INTO `Cargos` (`Id_cargo`, `Nombre_cargo`) VALUES
(1, 'Administrador'),
(2, 'Cajero'),
(3, 'Dueño');

INSERT INTO Estado_medios_pago (Id_estado_medio_pago , Nombre_estado_medio_pago) VALUES 
(1, 'Activo'), 
(0, 'Inactivo');

INSERT INTO `Medio_pagos` (`Id_pago`, `Nombre_pago`) VALUES
(1, 'Efectivo'),
(2, 'Transbank Debito Nacional'),
(3, 'SumUp Credito'),
(4, 'SumUp Debito'),
(5, 'Transbank Credito Nacional'),
(6, 'Transferencia'),
(7, 'Transbank Credito Extranjero'),
(8, 'Transbank Debito Extranjero');

INSERT INTO `Estado_usuarios` (`Id_estado_usuario`, `Nombre_estado_usuario`) VALUES 
(1, 'Activo'), 
(0, 'Inactivo');

INSERT INTO `Estado_ventas` (`Nombre_estado_venta`) VALUES
('Pagada'),
('Cancelada'),
('Devuelta'),
('Parcialmente pagada');

INSERT INTO `Usuarios` (`Id_usuario`, `Nombre`, `Apellido_1`, `Apellido_2`, `Contrasena`, `Cargo`) VALUES
(210463003, 'Benjamin', 'Villablanca', 'Zuñiga', '$argon2i$v=19$m=16,t=2,p=1$b2xCSFgxVzF1SnhZUGJySg$HYmqPvP8tXr0XqSptyFTrA', 1),
(212058890, 'Diego', 'Muñoz', 'Sazo', '$argon2i$v=19$m=16,t=2,p=1$b2xCSFgxVzF1SnhZUGJySg$HYmqPvP8tXr0XqSptyFTrA', 1),
(212322636, 'Esteban', 'Rojas', 'Calderon', '$argon2i$v=19$m=16,t=2,p=1$b2xCSFgxVzF1SnhZUGJySg$HYmqPvP8tXr0XqSptyFTrA', 1),
(205211667, 'Felipe', 'Ramos', 'Bustos', '$argon2i$v=19$m=16,t=2,p=1$b2xCSFgxVzF1SnhZUGJySg$HYmqPvP8tXr0XqSptyFTrA', 1),
(205329706, 'Cristobal', 'Artus', 'Scheel', '$argon2i$v=19$m=16,t=2,p=1$b2xCSFgxVzF1SnhZUGJySg$HYmqPvP8tXr0XqSptyFTrA', 1);

INSERT INTO Productos (Id_producto, Nombre, Precio_venta, Stock) VALUES
(1, 'Camiseta', 15990, 120),
(2, 'Pantalón', 29990, 80),
(3, 'Zapatillas', 59990, 45),
(4, 'Gorra', 9990, 100),
(5, 'Chaqueta', 89500, 30);

INSERT INTO Lote_productos (Id_producto, Precio_compra, Cantidad, Stock, Fecha) VALUES
(1, 10000, 50, 50, '2025-05-01'),
(1, 11000, 70, 70, '2025-05-20'),
(2, 20000, 50, 50, '2025-05-05'),
(2, 21500, 30, 30, '2025-05-22'),
(3, 40000, 25, 25, '2025-05-10'),
(3, 42000, 20, 20, '2025-05-24'),
(4, 6000, 100, 100, '2025-05-15'),
(5, 60000, 30, 30, '2025-05-18');


-- TRIGGERS
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
