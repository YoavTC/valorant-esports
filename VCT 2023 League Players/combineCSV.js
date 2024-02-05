const fs = require('fs');
const path = require('path');

const inputFolder = './combineCSV'; // specify the input folder where your CSV files are located
const outputFileName = 'combined.csv'; // specify the output file name

const combinedData = {};

fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  // Filter files to only include CSV files
  const csvFiles = files.filter(file => path.extname(file).toLowerCase() === '.csv');

  // Process each CSV file
  csvFiles.forEach(file => {
    const filePath = path.join(inputFolder, file);

    // Read the content of the CSV file
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Split the content into rows
    const rows = fileContent.split('\n');

    // Extract headers from the first row
    const headers = rows[0].split(',');

    // Process each data row (skip the header row)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(',');

      // Use the first column as the key
      const key = row[0];

      // If the key already exists, add up the numerical values; otherwise, add a new entry
      if (combinedData[key]) {
        for (let j = 1; j < row.length; j++) {
          combinedData[key][headers[j]] += parseInt(row[j], 10) || 0;
        }
      } else {
        // Initialize the combinedData with zero values for each column
        combinedData[key] = {};
        for (let j = 1; j < row.length; j++) {
          combinedData[key][headers[j]] = parseInt(row[j], 10) || 0;
        }
      }
    }

    console.log(`Processed ${file}`);
    if (csvFiles.indexOf(file) === csvFiles.length - 1) {
      // If this is the last file, write the combined data to the output file
      writeCombinedCSV();
    }
  });
});

function writeCombinedCSV() {
  const outputFilePath = path.join(__dirname, outputFileName);

  // Write the combined data to the output file
  fs.writeFileSync(outputFilePath, '');

  // Append each row to the output file
  Object.keys(combinedData).forEach(key => {
    const rowString = `${key},${Object.values(combinedData[key]).join(',')}\n`;
    fs.appendFileSync(outputFilePath, rowString);
  });

  console.log(`Combined CSV file created: ${outputFileName}`);
}
