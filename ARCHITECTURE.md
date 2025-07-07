# Climatiq MCP Server Architecture

This document describes the modular architecture of the Climatiq MCP Server, which has been refactored from a single large file into a well-organized, maintainable structure.

## Directory Structure

```
src/
├── index.ts                    # Main entry point (minimal)
├── server/
│   ├── ClimatiqMCPServer.ts   # Main server class (orchestration)
│   └── handlers/
│       ├── ToolHandlers.ts     # Tool execution logic
│       └── ToolDefinitions.ts  # Tool schemas and configurations
├── services/
│   └── ClimatiqService.ts      # API service layer
├── models/
│   ├── EmissionFactor.ts       # Emission factor data model
│   └── Calculation.ts          # Calculation result model
├── types/
│   └── index.ts               # TypeScript interfaces and types
└── utils/
    ├── ParameterBuilder.ts     # Parameter building logic
    └── ErrorHandler.ts         # Error handling utilities
```

## Architecture Overview

### 1. **Separation of Concerns**

The code is now organized into distinct layers with clear responsibilities:

- **Server Layer** (`server/`): Handles MCP protocol communication
- **Service Layer** (`services/`): Manages external API interactions
- **Model Layer** (`models/`): Encapsulates data structures and business logic
- **Utility Layer** (`utils/`): Provides reusable helper functions
- **Type Layer** (`types/`): Defines TypeScript interfaces and types

### 2. **Key Components**

#### **ClimatiqMCPServer** (`server/ClimatiqMCPServer.ts`)
- Main orchestrator class
- Sets up MCP server and handlers
- Coordinates between different components
- Minimal and focused on server setup

#### **ClimatiqService** (`services/ClimatiqService.ts`)
- Handles all Climatiq API interactions
- Encapsulates API-specific logic
- Provides clean interface for data operations
- Handles API responses and error processing

#### **ToolHandlers** (`server/handlers/ToolHandlers.ts`)
- Routes tool requests to appropriate handlers
- Converts between MCP format and service format
- Provides error handling for tool execution

#### **ToolDefinitions** (`server/handlers/ToolDefinitions.ts`)
- Centralized tool schema definitions
- Easy to maintain and extend
- Separates configuration from logic

#### **Model Classes** (`models/`)
- **EmissionFactor**: Encapsulates emission factor data with helper methods
- **Calculation**: Encapsulates calculation results with formatting methods
- Provide type safety and business logic encapsulation

#### **Utility Classes** (`utils/`)
- **ParameterBuilder**: Handles complex parameter building logic for different unit types
- **ErrorHandler**: Centralized error processing and formatting

### 3. **Benefits of This Architecture**

#### **Maintainability**
- Each file has a single responsibility
- Easy to locate and modify specific functionality
- Clear separation between concerns

#### **Testability**
- Components can be tested in isolation
- Dependencies are clearly defined
- Mock services can be easily injected

#### **Extensibility**
- New tools can be added by extending tool definitions
- New unit types can be added to ParameterBuilder
- New models can be created without affecting existing code

#### **Type Safety**
- Comprehensive TypeScript interfaces
- Strong typing throughout the application
- Compile-time error detection

#### **Error Handling**
- Centralized error processing
- Consistent error messages
- Proper error propagation

### 4. **Data Flow**

```
MCP Request → ClimatiqMCPServer → ToolHandlers → ClimatiqService → Climatiq API
                ↓
            Model Classes (EmissionFactor, Calculation)
                ↓
            Utility Classes (ParameterBuilder, ErrorHandler)
```

### 5. **Adding New Features**

#### **Adding a New Tool**
1. Add tool definition to `ToolDefinitions.ts`
2. Add handler method to `ToolHandlers.ts`
3. Add corresponding service method to `ClimatiqService.ts` if needed

#### **Adding a New Unit Type**
1. Add interface to `types/index.ts`
2. Add case to `ParameterBuilder.ts`
3. Update union type in `types/index.ts`

#### **Adding a New Model**
1. Create new model class in `models/`
2. Add corresponding interface to `types/index.ts`
3. Use the model in relevant services

### 6. **Best Practices**

- **Dependency Injection**: Services are injected into handlers
- **Single Responsibility**: Each class has one clear purpose
- **Type Safety**: Use TypeScript interfaces throughout
- **Error Handling**: Centralized and consistent error processing
- **Documentation**: JSDoc comments for public methods
- **Immutability**: Model classes use readonly properties where possible

This architecture provides a solid foundation for future development while maintaining clean, readable, and maintainable code. 