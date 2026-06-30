package com.pizzeria.mamamia.repository;

import com.pizzeria.mamamia.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    // NUEVO: Le enseñamos a la base de datos a buscar por el número de ticket
    Optional<Pedido> findByNumPedido(String numPedido);
}