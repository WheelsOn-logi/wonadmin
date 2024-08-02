import multer from 'multer';
import XLSX from 'xlsx';
import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

const apiKey = 'ALbCgtIvfsg5oXZQ4S6TtxEuX7VtAzo016dy7GlHZKlMlvR35RUkdxDCuxRxh6Wo';
const endpoint = 'https://ap-south-1.aws.data.mongodb-api.com/app/data-ffiqjii/endpoint/data/v1';
const dataSource = 'lokesh25';
const database = 'lokesh25';
const collection = 'user_info';
const supplierCollection = 'won';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../')));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/add-supplier', upload.single('excelFile'), async (req, res) => {
    const supplierName = req.body.supplierName;
    const file = req.file;

    try {
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const supplierData = jsonData.map(row => ({
            supplier_name: supplierName,
            distance_range: row['distance_range'],
            price_per_kg_0_100: row['price_per_kg_0_100'],
            price_per_kg_100_300: row['price_per_kg_100_300'],
            price_per_kg_300_500: row['price_per_kg_300_500'],
            price_per_kg_500_1000: row['price_per_kg_500_1000'],
            price_per_kg_1000_plus: row['price_per_kg_1000_plus'],
            tat: row['tat']
        }));

        await fetch(`${endpoint}/action/insertMany`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey,
            },
            body: JSON.stringify({
                dataSource,
                database,
                collection: supplierCollection,
                documents: supplierData
            })
        });

        res.send('Supplier data uploaded successfully');
    } catch (error) {
        console.error('Error uploading supplier data:', error);
        res.status(500).send('An error occurred while uploading supplier data');
    }
});




app.post('/login', async (req, res) => {
    const { user, password } = req.body;
    try {
        const response = await fetch(`${endpoint}/action/findOne`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey,
            },
            body: JSON.stringify({
                dataSource,
                database,
                collection,
                filter: { user, password }
            })
        });

        const data = await response.json();

        if (data.document) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        res.status(500).send('An error occurred while processing your request');
    }
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, './', 'admin.html'));
});

app.get('/get-suppliers', async (req, res) => {
  try {
      const response = await fetch(`${endpoint}/action/find`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'api-key': apiKey,
          },
          body: JSON.stringify({
              dataSource,
              database,
              collection: supplierCollection,
              filter: {},
              projection: { supplier_name: 1 }
          })
      });

      const data = await response.json();
      const suppliers = data.documents.map(doc => doc.supplier_name);
      const distinctSuppliers = [...new Set(suppliers)];
      res.json(distinctSuppliers);
  } catch (error) {
      res.status(500).send('An error occurred while fetching suppliers');
  }
});

app.get('/view-supplier', async (req, res) => {
    const supplierName = req.query.name;
    try {
        const response = await fetch(`${endpoint}/action/find`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey,
            },
            body: JSON.stringify({
                dataSource,
                database,
                collection: supplierCollection,
                filter: { supplier_name: supplierName }
            })
        });

        const data = await response.json();
        if (data && data.documents) {
            res.json(data.documents); // Return array of documents (rows)
        } else {
            res.json([]); // Return empty array if no documents found
        }
    } catch (error) {
        res.status(500).send('An error occurred while fetching supplier data');
    }
});


app.delete('/delete-supplier', async (req, res) => {
    const supplierName = req.query.name;
    try {
        const response = await fetch(`${endpoint}/action/deleteMany`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey,
            },
            body: JSON.stringify({
                dataSource,
                database,
                collection: supplierCollection,
                filter: { supplier_name: supplierName }
            })
        });

        // Check response status or use response.json() if necessary
        res.send('Supplier deleted');
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).send('An error occurred while deleting the supplier');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
