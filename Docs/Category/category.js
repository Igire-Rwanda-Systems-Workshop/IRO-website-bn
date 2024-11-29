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
     '/api/Inventory/category/update/{id}':
     {
       put: {
       summary: 'Update Category',
       tags: ['Categories'],
       description: 'This endpoint updates an existing category.',
       parameters: [
         {
           name: 'id',
           in: 'path',
           required: true,
           description: 'ID of the category',
           schema: { type: 'string' },
         },
       ],
       requestBody: {
         required: true,
         content: {
           'application/json': {
             schema: {
               type: 'object',
               properties: {
                 name: { type: 'string' },
                 description: { type: 'string' },
               },
               required: ['name', 'description'],
             },
           },
         },
       },
       responses: {
         '200': {
           description: 'Category updated successfully',
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
};

export default categoryPaths;
