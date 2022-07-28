# Local Library Project

There are two entities: users and books. Operations include manipulating entity data and requesting a 3rd party service (OpenWeatherMap API).
## Development Stack:
- JS
- ExpressJS

## Stack explanation
Express JS was chosen due to the fact that it does not require a specific structure and doesn’t have a set of pre-defined rules to follow, which is convenient for one-person development teams and gives an opportunity to experiment with different scenarios.+

## User Schema

| Properties  | Data Types                  | Unique        | Required |
|-------------|-----------------------------|---------------|----------|
| _id         | ObjectId                    | true          | true     |
| username    | String                      | true          | true     |
| username    | String                      | true          | true     |
| email       | String                      | true          | true     |
| password    | String                      | true          | true     |
| roles       | Array                       | true          | true     |


## Book Schema

| Properties  | Data Types                  | Unique        | Required |
|-------------|-----------------------------|---------------|----------|
| _id         | ObjectId                    | true          | true     |
| title       | String                      | false         | true     |
| author      | String                      | false         | true     |
| genre       | String                      | false         | true     |
| description | String                      | false         | true     |


## Role Schema

| Properties  | Data Types                  | Unique        | Required |
|-------------|-----------------------------|---------------|----------|
| _id         | ObjectId                    | true          | true     |
| value       | String                      | true          | true     |

## Token Schema

| Properties  | Data Types                  | Unique        | Required |
|-------------|-----------------------------|---------------|----------|
| _id         | ObjectId                    | true          | true     |
| token       | String                      | true          | true     |
| userId      | String                      | false         | true     |

