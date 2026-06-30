CREATE DATABASE IF NOT EXISTS mamamia_db;
USE mamamia_db;

CREATE TABLE usuarios (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          nombre VARCHAR(100) NOT NULL,
                          correo VARCHAR(100) UNIQUE NOT NULL,
                          password VARCHAR(255) NOT NULL,
                          rol VARCHAR(20) DEFAULT 'CLIENTE'
);

CREATE TABLE productos (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           nombre VARCHAR(100) NOT NULL,
                           categoria VARCHAR(50) NOT NULL,
                           descripcion TEXT,
                           precio_personal DECIMAL(10,2) NOT NULL,
                           precio_mediana DECIMAL(10,2) NOT NULL,
                           precio_familiar DECIMAL(10,2) NOT NULL,
                           estado VARCHAR(20) DEFAULT 'activo',
                           imagen_url VARCHAR(255)
);

CREATE TABLE pedidos (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         num_pedido VARCHAR(20) UNIQUE NOT NULL,
                         cliente_nombre VARCHAR(100) NOT NULL,
                         telefono VARCHAR(20) NOT NULL,
                         direccion VARCHAR(255),
                         modalidad VARCHAR(50) NOT NULL,
                         metodo_pago VARCHAR(50) NOT NULL,
                         total DECIMAL(10,2) NOT NULL,
                         estado INT DEFAULT 0,
                         fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detalle_pedidos (
                                 id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                 pedido_id BIGINT,
                                 producto_nombre VARCHAR(100) NOT NULL,
                                 tamano VARCHAR(50) NOT NULL,
                                 cantidad INT NOT NULL,
                                 subtotal DECIMAL(10,2) NOT NULL,
                                 FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

INSERT INTO usuarios (nombre, correo, password, rol) VALUES
    ('Administrador', 'admin@mamamia.com', 'admin123', 'ADMIN');