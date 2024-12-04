const categoryPaths = {
  '/api/Inventory/category': {
    post: {
      summary: 'Create Category',
      tags: ['Categories'],
      description: 'This endpoint is used to create a new product category.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                categoryName: { type: 'string' },
              
              },
              required: ['categoryName'],
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Category created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  category: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      description: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Invalid request data',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    
    
  },
  '/api/Inventory/category/{id}': {
    get: {
      summary: 'Get Category by ID',
      tags: ['Categories'],
      description: 'This endpoint retrieves a specific category by its ID.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID of the category',
          schema: { type: 'string' },
        },
      ],
      responses: {
        '200': {
          description: 'Category retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        '404': {
          description: 'Category not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
   },
  '/api/Inventory/category/getAll':{
      get: {
        summary: 'Get All Categories',
        tags: ['Categories'],
        description: 'This endpoint retrieves all categories.',
        responses: {
          '200': {
            description: 'Categories retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      description: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/Inventory/category/delete/{id}':{
      delete: {
        summary: 'Delete Category',
        tags: ['Categories'],
        description: 'This endpoint deletes a category by its ID.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the category',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Category deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
     },
     '/api/Inventory/category/update/{id}':{
     "put": {
      "summary": "Update a category",
      "description": "Updates the name of a category by its ID.",
      "tags": ["Categories"],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "The ID of the category to update",
          "schema": {
            "type": "string",
            "example": "60d21b4667d0d8992e610c85"
          }
        }
      ],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "categoryName": {
                  "type": "string",
                  "description": "The new name for the category",
                  "example": "Updated Category Name"
                }
              },
              "required": ["categoryName"]
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Category updated successfully",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string",
                    "example": "Category updated successfully"
                  },
                  "data": {
                    "type": "object",
                    "properties": {
                      "_id": {
                        "type": "string",
                        "example": "60d21b4667d0d8992e610c85"
                      },
                      "categoryName": {
                        "type": "string",
                        "example": "Updated Category Name"
                      },
                      "createdAt": {
                        "type": "string",
                        "format": "date-time",
                        "example": "2024-12-03T10:00:00Z"
                      },
                      "updatedAt": {
                        "type": "string",
                        "format": "date-time",
                        "example": "2024-12-03T10:30:00Z"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "Bad Request",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string",
                    "example": "Category name is required and cannot be empty."
                  },
                  "errors": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "example": "Validation Error Message"
                    }
                  }
                }
              }
            }
          }
        },
        "404": {
          "description": "Category not found",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string",
                    "example": "Category not found."
                  }
                }
              }
            }
          }
        },
        "409": {
          "description": "Duplicate category name",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string",
                    "example": "A category with this name already exists."
                  },
                  "duplicateField": {
                    "type": "string",
                    "example": "categoryName"
                  }
                }
              }
            }
          }
        },
        "500": {
          "description": "Internal server error",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string",
                    "example": "Internal server error"
                  },
                  "error": {
                    "type": "string",
                    "example": "Detailed error message"
                  }
                }
              }
            }
          }
        }
      }
    }
   
   },

   "/api/Inventory/category/product-count": {
      "get": {
        "summary": "Get product count by category",
        "description": "Retrieves the count of products in each category.",
        "tags": ["Categories"],
        "responses": {
          "200": {
            "description": "Product counts retrieved successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Product counts retrieved successfully"
                    },
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "categoryName": {
                            "type": "string",
                            "example": "Electronics"
                          },
                          "productCount": {
                            "type": "integer",
                            "example": 10
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "No categories found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "No categories found"
                    },
                    "data": {
                      "type": "array",
                      "example": []
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Internal server error"
                    },
                    "error": {
                      "type": "string",
                      "example": "Error fetching product counts"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
};

export default categoryPaths;
