package com.greencart.api_gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.cloud.gateway.server.mvc.filter.LoadBalancerFilterFunctions.lb;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.web.servlet.function.RequestPredicates.path;

@Configuration
public class GatewayConfig {

    @Bean
    public RouterFunction<ServerResponse> userServiceRoute() {
        return route("user-service")
                .route(path("/user/**"), http())
                .filter(lb("user-service"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> productServiceRoute() {
        return route("product-service")
                .route(path("/api/products/**")
                        .or(path("/api/categories/**"))
                        .or(path("/api/subcategories/**"))
                        .or(path("/stocks/**")), http())
                .filter(lb("product-service"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> adminServiceRoute() {
        return route("admin-service")
                .route(path("/admin/**"), http())
                .filter(lb("admin-service"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> buyerServiceRoute() {
        return route("buyer-service")
                .route(path("/buyer/**"), http())
                .filter(lb("buyer-service"))
                .build();
    }
}
