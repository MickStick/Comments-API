# Comments-API REST API

Welcome to the Comments-API REST API! This API forms an integral part of a larger system centered around managing posts. It specializes in facilitating the creation, management, and interaction with comments, replies, and likes. Built on Node.js, Express, Sequelize interfacing with MySQL, this API employs basic auth Authorization across all its endpoints.

## Introduction

The Comments-API serves as a robust tool within your system, empowering users to seamlessly create, modify, and interact with comment-related data associated with posts. Utilizing the power of Node.js and Sequelize, it ensures secure access through basic auth Authorization.

## Endpoints

### Comment Endpoints

The Comment endpoints within the Comments-API REST API offer various functionalities to manage comments, replies, and their interactions. Each endpoint serves a specific purpose in creating, updating, retrieving, or deleting comment-related records.

#### Create a New Comment (`/api/v1/comment/create`)

This endpoint is responsible for generating a new comment record within the system. By submitting a POST request to `/api/v1/comment/create` with a JSON object containing `uid`, `pid`, `replyTo`, and `comment`, users can create a new comment associated with a post.

Example Request Body:
```json
{
  "uid": 123,
  "pid": 456,
  "replyTo": null,
  "comment": "This is a new comment."
}
```

Example Response Body:

<u>Successful Response (HTTP Status Code: 200)</u>

```json
{
  "status": 200,
  "state": "success",
  "message": "Comment created successfully",
  "body": {
    "id": 1234,
    "uid": 123,
    "pid": 456,
    "replyTo": null,
    "comment": "This is a new comment.",
    "status": 1,
    "createdAt": "2023-12-17T12:00:00Z",
    "updatedAt": "2023-12-17T12:00:00Z"
  },
  "err": null
}
```

<u>Error Response (HTTP Status Code: 500)</u>

```json
{
  "status": 500,
  "state": "failure",
  "message": "Failed to create comment",
  "body": null,
  "err": {
    "message": "Internal server error",
    "err": {}
  }
}
```

#### Reply to a Comment (`/api/v1/comment/reply`)

The `/reply` endpoint facilitates the creation of a reply to an existing comment. Users need to send a POST request to `/api/v1/comment/reply` with a JSON object resembling the creation of a new comment, with an additional `replyTo` field specifying the ID of the comment being replied to.

Example Request Body:
```json
{
  "uid": 123,
  "pid": 456,
  "replyTo": 789,
  "comment": "This is a reply to a comment."
}
```

Example Response Body:

<u>Successful Response (HTTP Status Code: 200)</u>

```json
{
  "status": 200,
  "state": "success",
  "message": "Comment created successfully",
  "body": {
    "id": 1234,
    "uid": 123,
    "pid": 456,
    "replyTo": 789,
    "comment": "This is a reply to a comment.",
    "status": 1,
    "createdAt": "2023-12-17T12:00:00Z",
    "updatedAt": "2023-12-17T12:00:00Z"
  },
  "err": null
}
```

<u>Error Response (HTTP Status Code: 500)</u>

```json
{
  "status": 500,
  "state": "failure",
  "message": "Failed to create comment",
  "body": null,
  "err": {
    "message": "Internal server error",
    "err": {}
  }
}
```

<u>Error Response (HTTP Status Code: 404)</u>

```json
{
  "status": 404,
  "state": "failure",
  "message": "Comment not found",
  "body": null,
  "err": {
    "message": "Comment with ID 456 not found",
    "err": {}
  }
}
```

#### Update a Comment (`/api/v1/comment/update/:cid`)

The `/update/:cid` endpoint enables users to modify an existing comment by providing the comment ID (`:cid`) in the URL path along with a JSON body containing the updated comment details (`uid`, `pid`, `replyTo`, `comment`). This endpoint ensures seamless editing of comment content.

Example Request:
```plaintext
POST /api/v1/comment/update/1234
```

Example Request Body:
```json
{
  "uid": 123,
  "pid": 456,
  "replyTo": null,
  "comment": "Updated comment content."
}
```

Example Response Body:

<u>Successful Response (HTTP Status Code: 200)</u>

```json
{
  "status": 200,
  "state": "success",
  "message": "Comment created successfully",
  "body": {
    "id": 1234,
    "uid": 123,
    "pid": 456,
    "replyTo": null,
    "comment": "Updated comment content.",
    "status": 1,
    "createdAt": "2023-12-17T12:00:00Z",
    "updatedAt": "2023-12-17T12:00:00Z"
  },
  "err": null
}
```

<u>Error Response (HTTP Status Code: 500)</u>

```json
{
  "status": 500,
  "state": "failure",
  "message": "Failed to update comment 1234",
  "body": null,
  "err": {
    "message": "Internal server error",
    "err": {}
  }
}
```

<u>Error Response (HTTP Status Code: 404)</u>

```json
{
  "status": 404,
  "state": "failure",
  "message": "Comment not found",
  "body": null,
  "err": {
    "message": "Comment with ID 456 not found",
    "err": {}
  }
}
```

#### Delete a Comment (`/api/v1/comment/delete/:cid`)

The `/delete/:cid` endpoint serves for removing a specific comment from the system. Users should send a DELETE request to `/api/v1/comment/delete/:cid`, providing the comment ID (`:cid`) in the URL path to delete the corresponding comment record.

Example Request:
```plaintext
DELETE /api/v1/comment/delete/1234
```

Example Response Body:

<u>Successful Response (HTTP Status Code: 200)</u>

```json
{
  "status": 200,
  "state": "success",
  "message": "Comment deleted successfully",
  "body": null,
  "err": null
}
```

<u>Error Response (HTTP Status Code: 500)</u>

```json
{
  "status": 500,
  "state": "failure",
  "message": "Failed to delete comment 1234",
  "body": null,
  "err": {
    "message": "Internal server error",
    "err": {}
  }
}
```

<u>Error Response (HTTP Status Code: 404)</u>

```json
{
  "status": 404,
  "state": "failure",
  "message": "Comment not found",
  "body": null,
  "err": {
    "message": "Comment with ID 456 not found",
    "err": {}
  }
}
```

#### Retrieve Comments by Post ID (`/api/v1/comment/comments/:pid`)

This endpoint retrieves a list of comment records associated with a particular post ID (`pid`). By sending a GET request to `/api/v1/comment/comments/pid`, users can fetch comments related to a specific post for review or display purposes.

Example Request:
```plaintext
GET /api/v1/comment/comments/1234
```

Example Response Body:

<u>Successful Response (HTTP Status Code: 200)</u>

```json
{
    "status": 200,
    "state": "success",
    "message": "Comments have been retreived!",
    "body": [
        {
            "id": 1,
            "uid": 189,
            "pid": 10,
            "replyTo": null,
            "comment": "This is a comment",
            "status": 1,
            "createdAt": "2023-12-17T01:13:35.000Z",
            "updatedAt": "2023-12-17T01:13:35.000Z",
            "replies": "[{\"cid\": 3, \"pid\": 10, \"uid\": 12, \"comment\": \"This is a reply\", \"replyTo\": 1, \"createdAt\": \"2023-12-17 01:21:45.000000\", \"updatedAt\": \"2023-12-17 01:21:45.000000\"}]",
            "likes": 1
        },
        {
            "id": 2,
            "uid": 12,
            "pid": 10,
            "replyTo": null,
            "comment": "This is another comment;",
            "status": 1,
            "createdAt": "2023-12-17T01:20:37.000Z",
            "updatedAt": "2023-12-17T01:20:37.000Z",
            "replies": null,
            "likes": 0
        }
    ],
    "err": null
}
```

<u>Error Response (HTTP Status Code: 500)</u>

```json
{
  "status": 500,
  "state": "failure",
  "message": "Failed to retreive comments",
  "body": null,
  "err": {
    "message": "Internal server error",
    "err": {}
  }
}
```

<u>Error Response (HTTP Status Code: 404)</u>

```json
{
  "status": 404,
  "state": "failure",
  "message": "Post not found",
  "body": null,
  "err": {
    "message": "Post with ID 456 not found",
    "err": {}
  }
}
```



### Like Endpoints

The Like endpoints within the Comments-API REST API provide functionalities to manage interactions related to comment likes. These endpoints facilitate the creation, deletion, and retrieval of like records associated with comments.

#### Add a New Like (`/api/v1/like/add`)

The `/add` endpoint enables users to create a new like record for a comment. By submitting a POST request to `/api/v1/like/add` with a JSON object containing `cid` (comment ID) and `pid` (post ID), users can add a new like record associated with a comment.

Example Request Body:
```json
{
  "cid": 123,
  "pid": 456
}
```

Example Response Body:

<u>Successful Response (HTTP Status Code: 200)</u>

```json
{
  "status": 200,
  "state": "success",
  "message": "Like added successfully",
  "body": {
    "id": 123,
    "cid": 456,
    "pid": 789,
    "status": 1,
    "createdAt": "2023-12-17T12:00:00Z",
    "updatedAt": "2023-12-17T12:00:00Z"
  },
  "err": null
}
```

<u>Error Response (HTTP Status Code: 500)</u>

```json
{
  "status": 500,
  "state": "failure",
  "message": "Comment not liked",
  "body": null,
  "err": {
    "message": "Internal server error",
    "err": {}
  }
}
```


<u>Error Response (HTTP Status Code: 404)</u>

```json
{
  "status": 404,
  "state": "failure",
  "message": "Comment not found",
  "body": null,
  "err": {
    "message": "Comment with ID 456 not found",
    "err": {}
  }
}
```

#### Delete a Like (`/api/v1/like/delete/:id`)

The `/delete/:id` endpoint allows users to remove a specific like record by providing the like ID (`:id`) in the URL path. Sending a DELETE request to `/api/v1/like/delete/:id` deletes the corresponding like record.

Example Request:
```plaintext
DELETE /api/v1/like/delete/123
```

#### Retrieve Likes by Comment ID (`/api/v1/like/likes/cid`)

This endpoint retrieves a list of like records associated with a particular comment ID (`cid`). Users can obtain like records for a specific comment by sending a GET request to `/api/v1/like/likes/cid`.

Example Request:
```plaintext
GET /api/v1/like/likes/123
```

---

By following these endpoints, users can effectively manage interactions related to likes for comments within the Comments-API REST API. Feel free to include additional details, error handling, or any other relevant information to enhance the endpoint explanations.