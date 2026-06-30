package com.pizzeria.mamamia.repository;
import com.pizzeria.mamamia.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PedidoRepository extends JpaRepository<Pedido, Long> {}