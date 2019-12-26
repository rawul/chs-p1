# Start

- `npm i`
- Run `docker run -p 27017:27017 -d mongo` to start a mongo instance
- `npm start`

# Api spec
Whenever you start the server, an admin account will be created: `admin@admin.admin:123`

- `POST /auth/login`
  - Body: `{email: 'email@domain.com', password: '123'}` (emails are unique)
  - Responses: 
    - Status Code: `400` Body: `{ errors: 'Invalid Params'}` (in case email and password are not sent with the request)
    - Status Code: `403` Body: `{ errors: ... }` (in case the credentials are invalid)
    - Status Code: `200` Body: `{ token: 'test', email: 'email@domain.com', role: 'admin' }` (if everything went ok, the session will be returned. the admin role can create users and the client role is the one that can create surveys)

For the following routes you will need to set a the authorization headers with the name `authorization` and value `token`

### User management (ADMIN only)
- `POST /user` (This request will create a new client user)
  - Body: `{email: 'client@domain.com', password: '123'}` 
  - Responses:
     - Status Code: `403` Body: `{ error: 'Only admins can do this' }` (in case the user trying to do this is not an admin)
    - Status Code: `400` Body: `{errors: 'Client with email already existent'}` (in case client is already existent)
    - Status Code: `400` Body: `{ errors: ... }` (in case email and password are not sent with the request)
    - Status Code: `200` Body: `{email: 'email@domain.com', _id: '123dfweq3e21' }` (if everything went ok, the new user will be returned)

- `DELETE /user` (This request will create a new client user)
  - Body: `{email: 'client@domain.com' }`
  - Responses:
    - Status Code: `403` Body: `{ error: 'Only admins can do this' }` (in case the user trying to do this is not an admin)
    - Status Code: `400` Body: `{errors: 'Client not existent'}` (in case client is not existent)
    - Status Code: `200` Body: `{ success: true }` 

### Survey management
- `POST /survey` (Create a new survey)
  - Description: 
    - `name`, `description`, `questions.*.question` and `question.*.type` are required. `question.*.choices` is required only as explained below.
    - There are 3 types of question: "Open", "SingleChoice" and "MultipleChoice". The `SingleChoice` and `MultipleChoice` questions need to have a `choices` field where the available options will be put. The `Open` type will not have the `choices` field.
  - Body: 
    ```{
       "name": "Cel mai survey",
       "description": "Best survey on the globul pamantesc de la inceput",
       "active": true,
       "questions": [
        { 
          "question": "Cine ii smecher ?",
          "type": "Open"
        },
        { 
          "question": "Cine ii mai tare ?",
          "type": "SingleChoice",
          "choices": ["Vadim", "Tudor", "Mihai"]

        },
        { 
          "question": "Cati oameni iti plac de aici ?",
          "type": "MultipleChoice",
          "choices": ["Vadim", "Tudor", "Mihai"]
        }
       ]
    }
    ```
  - Responses
    - Status Code: `400` Body: `{ errors: ... }` (in case there were invalid params in the body)
    - Status Code: `200` Body: `{ success: true }` 

- `GET /survey/:id` will get a survey
  - Responses
      - Status Code: `404` Body: `{ error: 'Survey not found' }` (in case the survey is not found)
      - Status Code: `200` Body:
        ```
            {
        "surveyQuestions": [
            {
                "choices": [],
                "_id": "5e04a15f3bf04736ec7c7ef1",
                "question": "Cine ii smecher ?",
                "survey": "5e04a15f3bf04736ec7c7ef0",
                "type": "Open",
                "createdAt": "2019-12-26T12:02:39.853Z",
                "updatedAt": "2019-12-26T12:02:39.853Z",
                "__v": 0
            },
            {
                "choices": [
                    "Vadim",
                    "Tudor",
                    "Mihai"
                ],
                "_id": "5e04a15f3bf04736ec7c7ef2",
                "question": "Cine ii mai tare ?",
                "survey": "5e04a15f3bf04736ec7c7ef1",
                "type": "SingleChoice",
                "createdAt": "2019-12-26T12:02:39.853Z",
                "updatedAt": "2019-12-26T12:02:39.853Z",
                "__v": 0
            },
            {
                "choices": [
                    "Vadim",
                    "Tudor",
                    "Mihai"
                ],
                "_id": "5e04a15f3bf04736ec7c7ef3",
                "question": "Cati oameni iti plac de aici ?",
                "survey": "5e04a15f3bf04736ec7c7ef0",
                "type": "MultipleChoice",
                "createdAt": "2019-12-26T12:02:39.854Z",
                "updatedAt": "2019-12-26T12:02:39.854Z",
                "__v": 0
            }
        ],
        "_id": "5e04a15f3bf04736ec7c7ef0",
        "name": "Cel mai survey",
        "description": "Best survey on the globul pamantesc de la inceput",
        "active": true,
        "user": "5e048b7a6a1cae4838c5c0b3",
        "createdAt": "2019-12-26T12:02:39.853Z",
        "updatedAt": "2019-12-26T12:02:39.853Z",
        "__v": 0
        }
        ```
 ### Survey answers
- `POST /answers/:id` - the `id` is the survey id that you send the answers for
  - BODY `answers.*._id` needs to match the survey questions got from the request `GET /survey/:id`
    ```
        {
        "name": "Darius",
        "email": "darius@darius.darius",
        "answers": [
            {
                "value": "Open quesiton answer",
                "_id": "5e04a15f3bf04736ec7c7ef1"
             },
            {
                "value": "Single chioce answer",
                "_id": "5e04a15f3bf04736ec7c7ef2"
            },
            {
                "value": ["Mutiple", "Choice", "Question"],
                "_id": "5e04a15f3bf04736ec7c7ef3"
            }
        ]
    }
    ```
    - Responses
      - Status Code: `404` Body: ``{ error: 'Survey not found' }`` (in case the survey is not found)
      - Status Code: `400` Body: ``{ error: `Question ${question._id} was not answered !` }`` (in case a question has not been answered
      - Status Code: `400` Body: ``{ error: `Question ${question._id} has an array answers !` }`` (in case you don't send an array of values for `MultipleChoice` quesitons)
      - Status Code: `400` Body: ``{ error: `Question ${question._id} has a single value as answer !` }`` (in case you send an array of values for `Open` or `SingleChoice` quesitons)
      - Status Code: `400` Body: ``{ error: `Question ${question._id} has invalid choices !` }`` (one or more choies send do not match the `MultipleChoice` or `SingleChoice` quesiton choices)
      - Status Code: `200` Body: `{ success: true }` 



