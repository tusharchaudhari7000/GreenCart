package com.greencart.buyer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableDiscoveryClient
@SpringBootApplication
@ComponentScan(basePackages = "com.greencart.buyer")
@EnableJpaRepositories(basePackages = "com.greencart.buyer.repositories")
@EntityScan(basePackages = "com.greencart.buyer.entities")
public class GreenCartBuyerServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(GreenCartBuyerServiceApplication.class, args);
    }
}
