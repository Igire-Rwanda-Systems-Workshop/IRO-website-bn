const productPaths = {
  "/api/Inventory/product/create-product": {
    "post": {
      "tags": ["Products"],
      "summary": "Create a new product",
      "description": "Allows the Operations Manager to create a product under a specific category.",
      "security": [
        {
          "bearerAuth": []
        }
      ],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "prod_id": {
                  "type": "string",
                  "example": "P001",
                  "description": "Unique ID for the product"
                },
                "name": {
                  "type": "string",
                  "example": "Table",
                  "description": "Name of the product"
                },
                "brand": {
                  "type": "string",
                  "example": "WoodenWorks",
                  "description": "Brand of the product"
                },
                "dimensions": {
                  "type": "string",
                  "example": "120x60x75 cm",
                  "description": "Dimensions of the product"
                },
                "categoryId": {
                  "type": "string",
                  "format": "uuid",
                  "example": "64f5b3e59c12345abcd67890",
                  "description": "ID of the category the product belongs to"
                },
                "location": {
                  "type": "string",
                  "example": "Storage Room A",
                  "description": "Location of the product"
                },
                "status": {
                  "type": "string",
                  "enum": ["available", "borrowed"],
                  "example": "available",
                  "description": "Status of the product (default: 'available')"
                },
                "condition": {
                  "type": "string",
                  "enum": ["new", "used"],
                  "example": "new",
                  "description": "Condition of the product"
                },
                "productImage": {
                  "type": "string",
                  "example": "http://example.com/table.jpg",
                  "description": "URL of the product image"
                }
              },
              "required": ["prod_id", "name", "brand", "categoryId", "condition"]
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Product created successfully",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string",
                    "example": "Product created successfully in the specified category."
                  },
                  "data": {
                    "type": "object",
                    "properties": {
                      "_id": {
                        "type": "string",
                        "example": "64f5b3e59c12345abcd67890"
                      },
                      "prod_id": {
                        "type": "string",
                        "example": "P001"
                      },
                      "name": {
                        "type": "string",
                        "example": "Table"
                      },
                      "brand": {
                        "type": "string",
                        "example": "WoodenWorks"
                      },
                      "dimensions": {
                        "type": "string",
                        "example": "120x60x75 cm"
                      },
                      "categoryId": {
                        "type": "string",
                        "example": "64f5b3e59c12345abcd67890"
                      },
                      "location": {
                        "type": "string",
                        "example": "Storage Room A"
                      },
                      "status": {
                        "type": "string",
                        "example": "available"
                      },
                      "condition": {
                        "type": "string",
                        "example": "new"
                      },
                      "productImage": {
                        "type": "string",
                        "example": "http://example.com/table.jpg"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "400": {
          "description": "Validation error (e.g., missing required fields)",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string",
                    "example": "prod_id is required to create a product."
                  }
                }
              }
            }
          }
        },
        "403": {
          "description": "Access denied for non-Operations Managers",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string",
                    "example": "Access denied. Only Operations Managers can create products."
                  }
                }
              }
            }
          }
        },
        "404": {
          "description": "Invalid categoryId provided",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string",
                    "example": "Invalid category. Please provide a valid category ID."
                  }
                }
              }
            }
          }
        },
        "409": {
          "description": "Product ID already exists",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string",
                    "example": "A product with this ID already exists."
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
                    "example": "Failed to create product"
                  },
                  "error": {
                    "type": "string",
                    "example": "Error details here"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  
  "/api/Inventory/product/products-by-category/{categoryId}": {
    get: {
      tags: ["Products"],
      summary: "Retrieve products by category ID",
      description: "Retrieves all products belonging to a specific category.",
      parameters: [
        {
          name: "categoryId",
          in: "path",
          required: true,
          description: "The ID of the category to filter products by.",
          schema: { type: "string", example: "64f5b3e59c12345abcd67890" },
        },
      ],
      responses: {
        200: {
          description: "List of products under the specified category",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Products under category: Furniture",
                  },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        _id: {
                          type: "string",
                          example: "64f5b3e59c12345abcd67890",
                        },
                        prod_id: { type: "string", example: "P001" },
                        name: { type: "string", example: "Table" },
                        brand: { type: "string", example: "WoodenWorks" },
                        dimensions: { type: "string", example: "120x60x75 cm" },
                        categoryId: {
                          type: "string",
                          example: "64f5b3e59c12345abcd67890",
                        },
                        location: { type: "string", example: "Storage Room A" },
                        status: { type: "string", example: "available" },
                        condition: { type: "string", example: "new" },
                        productImage: {
                          type: "string",
                          example: "http://example.com/table.jpg",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Invalid categoryId provided or no such category exists",
        },
        500: { description: "Internal server error" },
      },
    },
  },

  "/api/Inventory/product/getById/{id}": {
    get: {
      tags: ["Products"],
      summary: "Get a single product by ID",
      description:
        "Retrieves a single product based on the provided product ID.",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
          },
          description: "The ID of the product to retrieve.",
        },
      ],
      responses: {
        200: {
          description: "Product retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product retrieved successfully",
                  },
                  data: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "64f5b3e59c12345abcd67890",
                      },
                      prod_id: {
                        type: "string",
                        example: "P001",
                      },
                      name: {
                        type: "string",
                        example: "Table",
                      },
                      brand: {
                        type: "string",
                        example: "WoodenWorks",
                      },
                      dimensions: {
                        type: "string",
                        example: "120x60x75 cm",
                      },
                      categoryId: {
                        type: "string",
                        example: "64f5b3e59c12345abcd67890",
                      },
                      location: {
                        type: "string",
                        example: "Storage Room A",
                      },
                      status: {
                        type: "string",
                        example: "available",
                      },
                      condition: {
                        type: "string",
                        example: "new",
                      },
                      productImage: {
                        type: "string",
                        example: "http://example.com/table.jpg",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid product ID format",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invalid product ID format.",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Product not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product not found.",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Failed to retrieve product.",
                  },
                  error: {
                    type: "string",
                    example: "Database connection error.",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/Inventory/product/getAll": {
    get: {
      tags: ["Products"],
      summary: "Get all productd",
      description:
        "Retrieves all products",
      responses: {
        200: {
          description: "Product retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product retrieved successfully",
                  },
                  data: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "64f5b3e59c12345abcd67890",
                      },
                      prod_id: {
                        type: "string",
                        example: "P001",
                      },
                      name: {
                        type: "string",
                        example: "Table",
                      },
                      brand: {
                        type: "string",
                        example: "WoodenWorks",
                      },
                      dimensions: {
                        type: "string",
                        example: "120x60x75 cm",
                      },
                      categoryId: {
                        type: "string",
                        example: "64f5b3e59c12345abcd67890",
                      },
                      location: {
                        type: "string",
                        example: "Storage Room A",
                      },
                      status: {
                        type: "string",
                        example: "available",
                      },
                      condition: {
                        type: "string",
                        example: "new",
                      },
                      productImage: {
                        type: "string",
                        example: "http://example.com/table.jpg",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid product ID format",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invalid product ID format.",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Product not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product not found.",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Failed to retrieve product.",
                  },
                  error: {
                    type: "string",
                    example: "Database connection error.",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/api/Inventory/product/update/{id}": {
    put: {
      tags: ["Products"],
      summary: "Update an existing product",
      description:
        "Updates an existing product by its ID. Can update any product fields.",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            
          },
          description: "The ID of the product to update.",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                prod_id: {
                  type: "string",
                  example: "P001",
                },
                name: {
                  type: "string",
                  example: "Table",
                },
                brand: {
                  type: "string",
                  example: "WoodenWorks",
                },
                dimensions: {
                  type: "string",
                  example: "120x60x75 cm",
                },
                categoryId: {
                  type: "string",
                  example: "64f5b3e59c12345abcd67890",
                },
                location: {
                  type: "string",
                  example: "Storage Room A",
                },
                status: {
                  type: "string",
                  enum: ["available", "borrowed"],
                  example: "available",
                },
                condition: {
                  type: "string",
                  enum: ["new", "used"],
                  example: "new",
                },
                productImage: {
                  type: "string",
                  example: "http://example.com/table.jpg",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Product updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product updated successfully",
                  },
                  data: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "64f5b3e59c12345abcd67890",
                      },
                      prod_id: {
                        type: "string",
                        example: "P001",
                      },
                      name: {
                        type: "string",
                        example: "Table",
                      },
                      brand: {
                        type: "string",
                        example: "WoodenWorks",
                      },
                      dimensions: {
                        type: "string",
                        example: "120x60x75 cm",
                      },
                      categoryId: {
                        type: "string",
                        example: "64f5b3e59c12345abcd67890",
                      },
                      location: {
                        type: "string",
                        example: "Storage Room A",
                      },
                      status: {
                        type: "string",
                        example: "available",
                      },
                      condition: {
                        type: "string",
                        example: "new",
                      },
                      productImage: {
                        type: "string",
                        example: "http://example.com/table.jpg",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid product ID format",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invalid product ID format.",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Product not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product not found.",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Failed to update product.",
                  },
                  error: {
                    type: "string",
                    example: "Database connection error.",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/api/Inventory/product/updateStatus/{id}": {
    "put": {
      "tags": ["Products"],
      "summary": "Update product's status and condition",
      "description": "Allows Operations Managers to update the status and/or condition of a product.",
      "security": [
        {
          "bearerAuth": []
        }
      ],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "The unique ID of the product to update.",
          "schema": {
            "type": "string"
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
                "status": {
                  "type": "string",
                  "description": "The updated status of the product. Allowed values: 'available', 'out_of_stock', 'archived'.",
                  "enum": ["available", "borrowed", "stolen"]
                },
                "condition": {
                  "type": "string",
                  "description": "The updated condition of the product. Allowed values: 'new', 'used', 'damaged'.",
                  "enum": ["new", "used", "damaged"]
                }
              },
              "example": {
                "status": "out_of_stock",
                "condition": "used"
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Product status and/or condition updated successfully.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string"
                  },
                  
                }
              },
              "example": {
                "message": "Product status and/or condition updated successfully.",
                "data": {
                  "prod_id": "1234",
                  "name": "Example Product",
                  "status": "out_of_stock",
                  "condition": "used",
                  "brand": "Example Brand",
                  "dimensions": "10x5x3",
                  "location": "Warehouse A",
                  "categoryId": "5678",
                  "productImage": "http://example.com/image.jpg",
                  "createdBy": "userId123"
                }
              }
            }
          }
        },
        "400": {
          "description": "Bad request. Validation failed for the provided data.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string"
                  }
                }
              },
              "example": {
                "message": "At least one of 'status' or 'condition' must be provided for updating."
              }
            }
          }
        },
        "403": {
          "description": "Access denied. Only Operations Managers can perform this action.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string"
                  }
                }
              },
              "example": {
                "message": "Access denied. Only Operations Managers can update product details."
              }
            }
          }
        },
        "404": {
          "description": "Product not found.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string"
                  }
                }
              },
              "example": {
                "message": "Product not found. Please provide a valid product ID."
              }
            }
          }
        },
        "500": {
          "description": "Internal server error.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string"
                  },
                  "error": {
                    "type": "string"
                  }
                }
              },
              "example": {
                "message": "Failed to update product status and/or condition.",
                "error": "Internal server error details."
              }
            }
          }
        }
      }
    }
  },
  "/api/Inventory/product/{id}": {
    delete: {
      tags: ["Products"],
      summary: "Delete a product",
      description: "Deletes a product by its ID.",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
           
          },
          description: "The ID of the product to delete.",
        },
      ],
      responses: {
        200: {
          description: "Product deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product deleted successfully",
                  },
                  data: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "64f5b3e59c12345abcd67890",
                      },
                      prod_id: {
                        type: "string",
                        example: "P001",
                      },
                      name: {
                        type: "string",
                        example: "Table",
                      },
                      brand: {
                        type: "string",
                        example: "WoodenWorks",
                      },
                      dimensions: {
                        type: "string",
                        example: "120x60x75 cm",
                      },
                      categoryId: {
                        type: "string",
                        example: "64f5b3e59c12345abcd67890",
                      },
                      location: {
                        type: "string",
                        example: "Storage Room A",
                      },
                      status: {
                        type: "string",
                        example: "available",
                      },
                      condition: {
                        type: "string",
                        example: "new",
                      },
                      productImage: {
                        type: "string",
                        example: "http://example.com/table.jpg",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid product ID format",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invalid product ID format.",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Product not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product not found.",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Failed to delete product.",
                  },
                  error: {
                    type: "string",
                    example: "Database connection error.",
                  },
                },
              },
            },
          },
        },
      },
    },
  },


  
  "/api/Inventory/product/product-status": {
        "get": {
          "summary": "Get Product Status by Month",
          "description": "Retrieve daily aggregation of product statuses (borrowed, stolen, damaged, available) for a specific month.",
          "parameters": [
            {
              "name": "year",
              "in": "query",
              "description": "The year for which to retrieve the product status. Defaults to the current year if not provided.",
              "required": false,
              "schema": {
                "type": "integer",
                "example": 2024
              }
            },
            {
              "name": "month",
              "in": "query",
              "description": "The month for which to retrieve the product status (1 for January, 12 for December). Defaults to the current month if not provided.",
              "required": false,
              "schema": {
                "type": "integer",
                "example": 11
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Product status retrieved successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {
                        "type": "string",
                        "example": "Product status retrieved successfully"
                      },
                      "data": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "dayofweek": {
                              "type": "integer",
                              "description": "Day of the week (0 for Sunday, 6 for Saturday).",
                              "example": 2
                            },
                            "borrowed": {
                              "type": "integer",
                              "description": "Number of borrowed products.",
                              "example": 5
                            },
                            "stolen": {
                              "type": "integer",
                              "description": "Number of stolen products.",
                              "example": 1
                            },
                            "damaged": {
                              "type": "integer",
                              "description": "Number of damaged products.",
                              "example": 2
                            },
                            "available": {
                              "type": "integer",
                              "description": "Number of available products.",
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
            "500": {
              "description": "Error retrieving product status",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {
                        "type": "string",
                        "example": "Error retrieving product status"
                      },
                      "error": {
                        "type": "string",
                        "example": "Internal Server Error"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  

export default productPaths;
