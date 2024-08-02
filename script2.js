document.getElementById('ext-sup-button').onclick = async function () {
  document.getElementById("add-supplier").style.display = "none";
  document.getElementById("existing-suppliers").style.display = "unset";
  document.getElementById("supplierDetails").style.display = "none";
  


  document.getElementById('addSupplierForm').onsubmit = async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    try {
        const response = await fetch('/add-supplier', {
            method: 'POST',
            body: formData
        });
        const message = await response.text();
        alert(message); // Show success message
        this.reset(); // Reset form
    } catch (error) {
        console.error('Error uploading supplier data:', error);
        alert('Failed to upload supplier data');
    }
};

  try {
      const response = await fetch('/get-suppliers');
      const suppliers = await response.json();
      
      const supplierList = document.getElementById('supplierList');
      supplierList.innerHTML = '';
      
      suppliers.forEach(supplier => {
          const row = document.createElement('tr');
          const nameCell = document.createElement('td');
          nameCell.textContent = supplier;

          
          const actionsCell = document.createElement('td');
          const viewButton = document.createElement('button');
          viewButton.textContent = 'View Datasheet';

          viewButton.onclick = async () => {
            try {
                const response = await fetch(`/view-supplier?name=${supplier}`);
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    displaySupplierDetails(data);
                } else {
                    console.log('No data found for supplier:', supplier);
                    // Handle case where no data is found (e.g., display message)
                }
            } catch (error) {
                console.error('Error fetching supplier data:', error);
            }
        };
        
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.onclick = async () => {
            try {
                const response = await fetch(`/delete-supplier?name=${supplier}`, { method: 'DELETE' });
                const message = await response.text();
                alert(message); // Show success message
                
                // Refresh supplier list
                document.getElementById('ext-sup-button').click(); // Trigger click to reload list
            } catch (error) {
                console.error('Error deleting supplier:', error);
                alert('Failed to delete supplier');
            }
        };
        
          actionsCell.appendChild(viewButton);
          actionsCell.appendChild(deleteButton);
          row.appendChild(nameCell);
          row.appendChild(actionsCell);
          supplierList.appendChild(row);
      });
  } catch (error) {
      console.error('Error fetching suppliers:', error);
  }
}

function displaySupplierDetails(data) {
  const supplierDetailsList = document.getElementById('supplierDetailsList');
  supplierDetailsList.innerHTML = '';
  
  if (data && data.length > 0) {
      data.forEach(doc => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${doc.supplier_name}</td>
              <td>${doc.distance_range}</td>
              <td>${doc.price_per_kg_0_100}</td>
              <td>${doc.price_per_kg_100_300}</td>
              <td>${doc.price_per_kg_300_500}</td>
              <td>${doc.price_per_kg_500_1000}</td>
              <td>${doc.price_per_kg_1000_plus}</td>
              <td>${doc.tat}</td>
          `;
          supplierDetailsList.appendChild(row);
      });
  }
  
  document.getElementById("existing-suppliers").style.display = "none";
  document.getElementById("supplierDetails").style.display = "unset";
}

document.getElementById('backButton').onclick = function () {
  document.getElementById("supplierDetails").style.display = "none";
  document.getElementById("existing-suppliers").style.display = "unset";
}
document.getElementById('add-sup-button').onclick = function () {
  document.getElementById("supplierDetails").style.display = "none";
  document.getElementById("existing-suppliers").style.display = "none";
  document.getElementById("add-supplier").style.display = "unset";
}
