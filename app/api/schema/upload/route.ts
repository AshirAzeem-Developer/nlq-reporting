import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("schema") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const content = buffer.toString("utf-8");

    console.log("📄 Processing file:", file.name);

    const parsedSchema = parseSchema(content, file.name);

    console.log(
      "✅ Parsed tables:",
      parsedSchema.tables.map((t: any) => t.name)
    );

    const schemaContextPath = path.join(
      process.cwd(),
      "app",
      "lib",
      "schema-context.ts"
    );
    const dirPath = path.dirname(schemaContextPath);

    await mkdir(dirPath, { recursive: true });

    const schemaCode = generateSchemaContext(parsedSchema);
    await writeFile(schemaContextPath, schemaCode);

    return NextResponse.json({
      success: true,
      message: "Schema uploaded and processed successfully",
      tablesFound: parsedSchema.tables.length,
      tables: parsedSchema.tables.map((t: any) => t.name),
      path: schemaContextPath,
    });
  } catch (error: any) {
    console.error("❌ Schema upload error:", error);
    return NextResponse.json(
      { error: "Failed to process schema", details: error.message },
      { status: 500 }
    );
  }
}

function parseSchema(content: string, filename: string) {
  if (filename.endsWith(".html") || filename.endsWith(".htm")) {
    return parseHTMLSchema(content);
  } else if (filename.endsWith(".sql")) {
    return parseSQLSchema(content);
  } else if (filename.endsWith(".json")) {
    return JSON.parse(content);
  }
  throw new Error("Unsupported file format");
}

function parseSQLSchema(sql: string) {
  const tables: any[] = [];

  // Match CREATE TABLE statements
  const createTableRegex =
    /CREATE TABLE\s+(?:IF NOT EXISTS\s+)?`?(\w+)`?\s*\(([\s\S]*?)\)\s*ENGINE=/gi;

  let match;
  while ((match = createTableRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const tableBody = match[2];

    console.log(`Parsing table: ${tableName}`);

    const columns = parseColumns(tableBody);
    const constraints = parseConstraints(tableBody);

    tables.push({
      name: tableName,
      columns,
      constraints,
    });
  }

  return { tables };
}

function parseColumns(tableBody: string) {
  const columns: any[] = [];
  const lines = tableBody.split("\n").map((l) => l.trim());

  for (const line of lines) {
    // Skip empty lines, constraints, and keys
    if (
      !line ||
      line.startsWith("PRIMARY KEY") ||
      line.startsWith("UNIQUE KEY") ||
      line.startsWith("KEY") ||
      line.startsWith("CONSTRAINT") ||
      line.startsWith("FOREIGN KEY")
    ) {
      continue;
    }

    // Match column definition: `column_name` type [constraints]
    const columnMatch = line.match(
      /^`?(\w+)`?\s+([^\s,]+(?:\([^)]+\))?)\s*(.*?)(?:,|$)/
    );

    if (columnMatch) {
      const [, name, type, constraints] = columnMatch;

      const column: any = {
        name,
        type: type.replace(/,$/, ""),
        nullable: !constraints.includes("NOT NULL"),
        autoIncrement: constraints.includes("AUTO_INCREMENT"),
        defaultValue: extractDefault(constraints),
        generated: constraints.includes("GENERATED"),
      };

      columns.push(column);
    }
  }

  return columns;
}

function parseConstraints(tableBody: string) {
  const constraints: any = {
    primaryKeys: [],
    uniqueKeys: [],
    foreignKeys: [],
    indexes: [],
  };

  const lines = tableBody.split("\n").map((l) => l.trim());

  for (const line of lines) {
    // Primary keys
    if (line.startsWith("PRIMARY KEY")) {
      const match = line.match(/PRIMARY KEY \(`?(\w+)`?\)/);
      if (match) constraints.primaryKeys.push(match[1]);
    }

    // Unique keys
    if (line.startsWith("UNIQUE KEY")) {
      const match = line.match(/UNIQUE KEY `?\w+`? \(`?(\w+)`?\)/);
      if (match) constraints.uniqueKeys.push(match[1]);
    }

    // Regular indexes
    if (line.match(/^KEY `?\w+`? \(`?(\w+)`?\)/)) {
      const match = line.match(/KEY `?\w+`? \(`?(\w+)`?\)/);
      if (match) constraints.indexes.push(match[1]);
    }
  }

  return constraints;
}

function extractDefault(constraints: string) {
  const match = constraints.match(
    /DEFAULT\s+([^,\s]+|'[^']+'|CURRENT_TIMESTAMP)/i
  );
  return match ? match[1].replace(/'/g, "") : null;
}

function parseHTMLSchema(html: string) {
  // Keep existing HTML parser
  const tables: any[] = [];
  const tableMatches = html.matchAll(/<p><a name='([^']+)'>/g);

  for (const match of tableMatches) {
    const tableName = match[1];
    if (!tableName || tableName === "header") continue;

    const tableStart = html.indexOf(`<a name='${tableName}'>`);
    const nextTableMatch = html.indexOf("<br class=page>", tableStart + 1);
    const tableSection = html.substring(
      tableStart,
      nextTableMatch > 0 ? nextTableMatch : html.length
    );

    const columns = extractColumnsFromHTML(tableSection);

    if (columns.length > 0) {
      tables.push({ name: tableName, columns, constraints: {} });
    }
  }

  return { tables };
}

function extractColumnsFromHTML(section: string) {
  const columns: any[] = [];
  const fieldRegex =
    /<td[^>]*><p class="normal">([^<]+)<\/td>\s*<td[^>]*><p class="normal">([^<]+)<\/td>/g;

  let match;
  let skipFirst = true;

  while ((match = fieldRegex.exec(section)) !== null) {
    const [, fieldName, fieldType] = match;

    if (skipFirst && fieldName.trim() === "Field") {
      skipFirst = false;
      continue;
    }

    if (fieldName && fieldType) {
      columns.push({
        name: fieldName.trim(),
        type: fieldType.trim(),
      });
    }
  }

  return columns;
}

function generateSchemaContext(parsedSchema: any) {
  const { tables } = parsedSchema;

  let context = `// Auto-generated E-commerce Database Schema\n`;
  context += `// Generated: ${new Date().toLocaleString()}\n`;
  context += `// Database: dashboarddb (MySQL 8.2.0)\n`;
  context += `// Tables: ${tables.length}\n\n`;

  context += `export const SCHEMA_CONTEXT = \`\n`;
  context += `# DASHBOARDDB E-COMMERCE SCHEMA\n\n`;

  // Generate table documentation
  for (const table of tables) {
    context += generateTableDoc(table);
  }

  // Generate relationships
  context += generateRelationships(tables);

  // Generate query patterns
  context += generateQueryPatterns();

  context += `\`;\n`;

  return context;
}

function generateTableDoc(table: any) {
  let doc = `## Table: ${table.name}\n`;

  // Add description
  const descriptions: Record<string, string> = {
    tbl_users: "Main user/customer accounts table",
    tbl_products: "Product catalog with pricing and availability",
    tbl_categories: "Product categories for organization",
    tbl_orders: "Customer orders and payment tracking",
    tbl_order_items: "Individual items within orders",
    tbl_cart: "Shopping cart for logged-in users",
    tbl_attachments: "Product images and file attachments",
    users: "Legacy user table (consider migrating to tbl_users)",
  };

  if (descriptions[table.name]) {
    doc += `${descriptions[table.name]}\n`;
  }

  doc += `Columns:\n`;

  for (const col of table.columns) {
    const constraints = [];

    if (table.constraints?.primaryKeys?.includes(col.name)) {
      constraints.push("PRIMARY KEY");
    }
    if (col.autoIncrement) {
      constraints.push("AUTO_INCREMENT");
    }
    if (table.constraints?.uniqueKeys?.includes(col.name)) {
      constraints.push("UNIQUE");
    }
    if (col.name.endsWith("_id") && col.name !== "id") {
      constraints.push("FOREIGN KEY");
    }
    if (col.generated) {
      constraints.push("GENERATED/COMPUTED");
    }
    if (col.defaultValue) {
      constraints.push(`DEFAULT: ${col.defaultValue}`);
    }

    const constraintStr =
      constraints.length > 0 ? ` [${constraints.join(", ")}]` : "";
    doc += `- ${col.name} (${col.type})${constraintStr}\n`;
  }

  doc += `\n`;
  return doc;
}

function generateRelationships(tables: any[]) {
  let rel = `---\n\n## RELATIONSHIP RULES:\n\n`;

  rel += `### Core Relationships:\n\n`;
  rel += `1. **Users → Orders:**\n`;
  rel += `   JOIN tbl_orders.user_id = tbl_users.id\n\n`;

  rel += `2. **Orders → Order Items:**\n`;
  rel += `   JOIN tbl_order_items.order_id = tbl_orders.id\n\n`;

  rel += `3. **Products → Order Items:**\n`;
  rel += `   JOIN tbl_order_items.product_id = tbl_products.id\n\n`;

  rel += `4. **Products → Categories:**\n`;
  rel += `   JOIN tbl_products.category_id = tbl_categories.id\n\n`;

  rel += `5. **Products → Attachments:**\n`;
  rel += `   JOIN tbl_attachments.product_id = tbl_products.id\n`;
  rel += `   (Use WHERE is_primary = 1 for main image)\n\n`;

  rel += `6. **Shopping Cart:**\n`;
  rel += `   JOIN tbl_cart.product_id = tbl_products.id\n`;
  rel += `   JOIN tbl_cart.user_id = tbl_users.id\n\n`;

  return rel;
}

function generateQueryPatterns() {
  let patterns = `---\n\n## COMMON QUERY PATTERNS:\n\n`;

  patterns += `### Revenue Queries:\n`;
  patterns += `- Total revenue: SUM(total_amount) WHERE payment_status = 'paid'\n`;
  patterns += `- Daily revenue: GROUP BY DATE(created_at)\n\n`;

  patterns += `### Order Status:\n`;
  patterns += `- payment_status: 'pending', 'paid', 'failed', 'refunded'\n`;
  patterns += `- order_status: 'pending', 'processing', 'shipped', 'delivered', 'cancelled'\n\n`;

  patterns += `### Product Filters:\n`;
  patterns += `- Active products: WHERE isActive = 1\n`;
  patterns += `- Hot/Featured: WHERE isHot = 1\n`;
  patterns += `- By category: JOIN tbl_categories ON category_id\n\n`;

  patterns += `### Payment Methods:\n`;
  patterns += `- 'cod' = Cash on Delivery\n`;
  patterns += `- 'card' = Credit/Debit Card\n\n`;

  patterns += `### Important Notes:\n`;
  patterns += `- tinyint(1) represents BOOLEAN (0=false, 1=true)\n`;
  patterns += `- decimal(10,2) for monetary values\n`;
  patterns += `- ENUM fields require exact quoted values\n`;
  patterns += `- subtotal in tbl_order_items is GENERATED (calculated automatically)\n`;

  return patterns;
}
