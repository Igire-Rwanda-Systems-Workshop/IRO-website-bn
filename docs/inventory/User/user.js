const userPaths = {
  '/api/Inventory/users/signup': {
    post: {
      summary: 'Admin Signup',
      tags: ['Users'],
      description: 'This is the endpoint for admin signup',
      
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
              },
              required: ['name', 'email', 'password'],
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Signup successful, check your email for OTP',
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
        '500': {
          description: 'Signup failed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  error: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/Inventory/users/verify-otp': {
    post: {
      summary: 'Verify OTP',
      tags: ['Users'],
      description: 'This endpoint verifies the OTP sent to the user email.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string' },
                otp: { type: 'string' },
              },
              required: ['email', 'otp'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Account verified successfully',
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
        '400': {
          description: 'Invalid OTP',
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
  '/api/Inventory/users/login': {
    post: {
      summary: 'User Login',
      tags: ['Users'],
      description: 'This endpoint logs in a user and returns a JWT token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string' },
                password: { type: 'string' },
              },
              required: ['email', 'password'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  token: { type: 'string' },
                  role: { type: 'string' },
                },
              },
            },
          },
        },
        '400': {
          description: 'Invalid email or password',
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
  '/api/Inventory/users/create-user': {
    post: {
      summary: 'Create User',
      tags: ['Users'],
      description: 'Endpoint for admin to create a new user. A random password is generated and sent to the user via email.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
              },
              required: ['name', 'email', 'role'],
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'User created successfully, credentials sent via email',
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
        '500': {
          description: 'Failed to create user',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  error: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/Inventory/users': {
    get: {
      summary: 'Get All Users',
      tags: ['Users'],
      description: 'Retrieve a list of all users',
      responses: {
        '200': {
          description: 'Users retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  users: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string' },
                        isVerified: { type: 'boolean' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '500': {
          description: 'Failed to retrieve users',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  error: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/Inventory/users/update-user/:id': {
    put: {
      summary: 'Update User',
      tags: ['Users'],
      description: 'Endpoint for admin to update an existing user. Includes verification flag.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID of the user to update',
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
                email: { type: 'string' },
                role: { type: 'string' },
              },
              required: ['name', 'email', 'role'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'User updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  updatedUser: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      email: { type: 'string' },
                      role: { type: 'string' },
                      isVerified: { type: 'boolean' },
                    },
                  },
                },
              },
            },
          },
        },
        '404': {
          description: 'User not found',
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
        '500': {
          description: 'Failed to update user',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  error: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    '/api/Inventory/users/delete-user/{id}':{
      delete: {
        summary: 'Delete User',
        tags: ['Users'],
        description: 'Endpoint for admin to delete an existing user by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the user to delete',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'User deleted successfully',
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
            description: 'User not found',
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
          '500': {
            description: 'Failed to delete user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    error: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    }
  },
  // '/api/users/forgotPassword': {
  //   post: {
  //     summary: 'Forgot Password',
  //     tags: ['Users'],
  //     description: 'This endpoint allows users to request a password reset link',
  //     requestBody: {
  //       required: true,
  //       content: {
  //         'application/json': {
  //           schema: {
  //             type: 'object',
  //             properties: {
  //               email: { type: 'string' },
  //             },
  //             required: ['email'],
  //           },
  //         },
  //       },
  //     },
  //     responses: {
  //       '200': {
  //         description: 'Reset token sent to your email',
  //         content: {
  //           'application/json': {
  //             schema: {
  //               type: 'object',
  //               properties: {
  //                 message: { type: 'string' },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       '404': {
  //         description: 'User not found',
  //         content: {
  //           'application/json': {
  //             schema: {
  //               type: 'object',
  //               properties: {
  //                 message: { type: 'string' },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       '500': {
  //         description: 'Error requesting password reset',
  //         content: {
  //           'application/json': {
  //             schema: {
  //               type: 'object',
  //               properties: {
  //                 message: { type: 'string' },
  //                 error: { type: 'string' },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // },
  
    "/api/Inventory/users/change-password": {
      "put": {
        "summary": "Change Password",
        "tags": ["Users"],
        "description": "Allows an authenticated user to change their password.",
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
                  "currentPassword": {
                    "type": "string",
                    "description": "The user's current password."
                  },
                  "newPassword": {
                    "type": "string",
                    "description": "The user's new password."
                  }
                },
                "required": ["currentPassword", "newPassword"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Password updated successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Password updated successfully."
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validation error (missing fields).",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Both current and new passwords are required."
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Authentication or authorization error.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Current password is incorrect."
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Server error.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Failed to update password."
                    },
                    "error": {
                      "type": "string",
                      "example": "Detailed error message."
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

export default userPaths;