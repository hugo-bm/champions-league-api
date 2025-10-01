# Arquitetura da Aplicação

Este documento resume as principais decisões arquiteturais da **API Champions League**.

## Diagram do contexto

![C4 Context Diagram](./context-diagram-c4.svg)

## Banco de Dados / Persistência
Optamos por um **arquivo JSON** como forma de persistência, considerando que os dados da aplicação são limitados e não exigem um banco relacional ou escalabilidade avançada. Essa abordagem simplifica a manutenção inicial e reduz dependências externas.

## Autenticação
A API não possui autenticação neste momento, pois o foco é disponibilizar dados públicos sobre equipes, jogadores, partidas e classificações. Em evoluções futuras, poderá ser adicionada autenticação baseada em **tokens JWT** caso seja necessário restringir o acesso.

## Cache
Não foi implementado mecanismo de cache no momento, dado o baixo volume de requisições esperado. Para cenários de maior carga, poderá ser adotado **cache em memória** ou soluções como **Redis**, aplicando TTL de 30–60 segundos em consultas mais pesadas.

## Filas e Processamento Assíncrono
Não há filas previstas. O processamento é síncrono e direto, suficiente para o escopo atual. Em caso de expansão (ex.: ingestão de dados em tempo real), poderá ser avaliada a adoção de filas simples (ex.: RabbitMQ ou SQS).

---
