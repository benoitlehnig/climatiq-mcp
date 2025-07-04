# Climatiq Emissions MCP Server

An intelligent MCP (Model Context Protocol) server that analyzes documents for emissions data and automatically calculates CO2 emissions using the Climatiq API. Built for seamless integration with Claude AI.

## 🌟 Features

- **Intelligent Document Analysis**: Uses Claude's native understanding to extract emissions data from any document type
- **Automated Emission Calculations**: Integrates with Climatiq API for accurate emission factors
- **Multi-Format Support**: Works with PDFs, images, scanned documents, and more
- **Smart Matching**: Intelligently matches materials and activities to emission factors
- **Flexible Output**: JSON, CSV, summary, and detailed report formats
- **Conversation-Based Interface**: Natural language interaction through Claude

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Climatiq API key ([sign up here](https://climatiq.io))
- Claude Desktop or any MCP-compatible client

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/climatiq-emissions-mcp-server.git
   cd climatiq-emissions-mcp-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your CLIMATIQ_API_KEY
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

### Configuration

Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "climatiq-emissions": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "CLIMATIQ_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## 📖 Usage

### Basic Document Analysis

1. Upload any document containing emissions data to Claude
2. Ask: "Can you analyze this document for CO2 emissions?"
3. Claude will extract materials, quantities, and activities
4. The server automatically matches with Climatiq emission factors
5. Get detailed emissions calculations and insights

### Example Workflow

```
User: "Analyze this construction materials list for emissions"
[uploads PDF]

Claude: "I found these materials:
- Concrete: 150 tonnes
- Steel rebar: 25 tonnes  
- Aluminum windows: 500 kg

Total emissions: 109.25 tonnes CO2e
Breakdown: Steel (48%), Concrete (48%), Aluminum (4%)"
```

### Available Tools

- `analyze_emissions_document` - Intelligent document analysis
- `get_emission_suggestions` - Find emission factors for materials/activities
- `calculate_emissions` - Calculate CO2 emissions for specific items

## 🏗️ Architecture

```
Document → Claude Analysis → Climatiq API → Emissions Report
    ↓           ↓               ↓              ↓
   PDF      Extract Data    Match Factors   Calculate CO2
  Image     Understand      Get Rates       Generate Report
  Scan      Context         Validate        Format Output
```

## 🧪 Development

### Run in Development
```bash
npm run dev
```

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
npm start
```

## 📊 Example Use Cases

- **Construction Projects**: Material lists, energy consumption
- **Transportation**: Fleet emissions, logistics data
- **Manufacturing**: Production materials, energy usage
- **Facilities**: Utility bills, maintenance records
- **Supply Chain**: Shipping manifests, procurement data

## 🔧 Configuration Options

### Document Types
- `construction` - Building materials and construction activities
- `transportation` - Vehicle usage and logistics
- `energy` - Electricity, fuel, and energy consumption
- `manufacturing` - Production processes and materials
- `general` - Any type of document

### Analysis Depth
- `quick` - Basic emissions sources only
- `detailed` - Direct and indirect emissions (default)
- `comprehensive` - Full lifecycle analysis

### Output Formats
- `json` - Structured data for API integration
- `csv` - Spreadsheet-compatible format
- `summary` - Executive summary with key metrics
- `report` - Detailed analysis report

## 🌍 Climatiq Integration

This server leverages the [Climatiq API](https://climatiq.io) for:
- Comprehensive emission factor database
- Regional variations and accuracy
- Scientific data sources
- Regular updates and validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Climatiq API Documentation](https://docs.climatiq.io)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude Desktop](https://claude.ai/desktop)

## 📧 Support

For questions or support, please open an issue on GitHub or contact [your-email@domain.com].

---

Built with ❤️ for a sustainable future 🌱