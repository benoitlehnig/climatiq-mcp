---
title: Climatiq MCP TypeScript Interface
emoji: 🌍
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# 🌍 Climatiq MCP TypeScript Interface

A **TypeScript-based Model Context Protocol (MCP) server** with web interface for calculating CO2 emissions using the Climatiq API.

## 🚀 Features

- **🔍 Search Emission Factors**: Find emission factors by keyword, region, and category
- **🧮 Calculate Emissions**: Calculate CO2 emissions using specific emission factors  
- **🌍 Multi-region Support**: Support for global emission factors (FR, DE---
title: Climatiq MCP Interface
emoji: 🌍
colorFrom: green
colorTo: blue
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
license: mit
---

# 🌍 Climatiq MCP Interface

A Gradio-based web interface to test the **Climatiq MCP (Model Context Protocol)** server functionality for calculating CO2 emissions.

## 🚀 Features

- **🔍 Search Emission Factors**: Find emission factors by keyword, region, and category
- **🧮 Calculate Emissions**: Calculate CO2 emissions using specific emission factors  
- **🌍 Multi-region Support**: Support for global emission factors (FR, DE, US, etc.)
- **📊 Interactive Results**: View detailed emission breakdowns and factor information
- **⚡ Quick Examples**: Pre-configured examples for common use cases

## 🛠️ How to Use

### 1. Configure API Key
This Space requires a Climatiq API key. To set it up:

1. Go to [Climatiq.io](https://climatiq.io) and create an account
2. Get your API key from the dashboard
3. In this Space's Settings → Repository secrets, add:
   - Name: `CLIMATIQ_API_KEY`
   - Value: Your Climatiq API key

### 2. Search for Emission Factors
- Enter search terms like "electricity", "concrete", "transport"
- Filter by region (FR, DE, US, etc.) and category
- Browse the results table to find appropriate emission factors

### 3. Calculate Emissions
- Copy the Activity ID from search results
- Enter your activity data (amount, unit, unit type)
- Specify the region if needed
- Click "Calculate Emissions" to get CO2eq results

## 📋 Example Use Cases

### Electricity Emissions
```
Search: "electricity france"
Activity ID: electricity-supply_grid-source_production_mix
Amount: 100 kWh (Energy) - Region: FR
Result: ~3-6 kg CO2eq (low carbon due to nuclear)
```

### Natural Gas Emissions  
```
Search: "natural gas industrial"
Activity ID: fuel-type_natural_gas-fuel_use_industrial
Amount: 10 m³ (Volume) - Region: CA
Result: ~20 kg CO2eq
```

### Transport Emissions
```
Search: "truck transport"
Select appropriate truck type from results
Amount: 100 km (Distance)
Result: Varies by vehicle type and load
```

## 🔧 Technical Details

This interface connects to the Climatiq API to:
- Search their database of 100,000+ emission factors
- Calculate accurate CO2 equivalent emissions  
- Support various unit types (Energy, Weight, Volume, Distance, Number)
- Provide detailed emission breakdowns (CO2, CH4, N2O)

## 📚 About Climatiq MCP

This interface demonstrates the capabilities of a Model Context Protocol (MCP) server for Climatiq, which can be integrated with AI assistants like Claude to provide real-time emission calculations in conversations.

## 🔗 Links

- [Climatiq API Documentation](https://docs.climatiq.io)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Source Code](https://github.com/yourusername/climatiq-emissions-mcp-server)

## 📄 License

MIT License - Feel free to use and modify for your sustainability projects!