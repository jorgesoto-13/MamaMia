package com.pizzeria.mamamia.model;

import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String categoria;
    private String descripcion;
    private Double precioPersonal;
    private Double precioMediana;
    private Double precioFamiliar;
    private String estado;
    private String imagenUrl;

    public Producto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Double getPrecioPersonal() { return precioPersonal; }
    public void setPrecioPersonal(Double precioPersonal) { this.precioPersonal = precioPersonal; }
    public Double getPrecioMediana() { return precioMediana; }
    public void setPrecioMediana(Double precioMediana) { this.precioMediana = precioMediana; }
    public Double getPrecioFamiliar() { return precioFamiliar; }
    public void setPrecioFamiliar(Double precioFamiliar) { this.precioFamiliar = precioFamiliar; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
}
