# opensource_socialmedia

MERN Stack Social Media

## Endpoints

| Method  | Endpoint                           | Description                      | Data                  | Access  |
|---------|------------------------------------|----------------------------------|-----------------------|---------|
| GET     | api/users/test                     | Test                             | `{"msg": ""}`         | Public  |
| POST    | api/users/register                 | Create an account                | `{"info": ""}`        | Private |
| POST    | api/users/login                    | Login                            | `{"info": ""}`        | Public  |
| GET     | api/users/current                  | Get current user                 | `{"info": ""}`        | Private |
| GET     | api/profile/test                   | Test                             | `{"msg": ""}`         | Public  |
| GET     | api/profile                        | Get current profile              | `{"info": ""}`        | Private |
| POST    | api/profile                        | Create or Update profile         | `{"info": ""}`        | Private |
| GET     | api/profile/handle/:handle         | Get current profile by handle    | `{"info": ""}`        | Private |
| GET     | api/profile/user/:user_id          | Get current profile by user id   | `{"info": ""}`        | Private |
| GET     | api/profile/all                    | Get all profile                  | `{"msg": ""}`         | Public  |
| POST    | api/profile/experience             | Get profile by experience        | `{"msg": ""}`         | Public  |
