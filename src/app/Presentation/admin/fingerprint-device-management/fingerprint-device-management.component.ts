import { Component } from '@angular/core';

@Component({
  selector: 'app-fingerprint-device-management',
  templateUrl: './fingerprint-device-management.component.html',
  styleUrls: ['./fingerprint-device-management.component.scss']
})
export class FingerprintDeviceManagementComponent {
// Variables for devices and employees
 devices:any[] = [];
 filteredDevices:any[] = [];
 currentDevicesPage = 1;
 devicesPerPage = 10; // Display 10 devices per page
 totalDevicesPages = 1;

 currentDeviceEmployees:any[] = [];
 filteredEmployees:any[] = [];
 currentUsersPage = 1;
 employeesPerPage = 10;
 totalUsersPages = 1;

 fingerprints:any[] = [];
 filteredFingerprints:any[] = [];
 currentFingerprintsPage = 1;
 fingerprintsPerPage = 10;
 totalFingerprintsPages = 1;

// Current selected employee code
 currentEmployeeCode = null;
 ngOnInit() {
// Initialize the page by generating data and populating the devices table
this.generateData();
this.populateDevicesTable(1);


 }
 //  to generate devices, employees, and fingerprints
 generateData() {
  // Arabic building names
  const buildingNames = [
    'المبنى الرئيسي',
    'مبنى الجراحة',
    'مبنى العيادات الخارجية',
    'مبنى الأشعة',
    'مبنى الأطفال',
    'مبنى النساء والتوليد',
    'مبنى القلب',
    'مبنى الكلى',
    'مبنى الطوارئ',
    'مبنى العظام',
    'مبنى الأنف والأذن والحنجرة',
    'مبنى العيون',
    'مبنى الأسنان',
    'مبنى الأمراض الجلدية',
    'مبنى المخ والأعصاب',
    'مبنى الأورام',
    'مبنى الباطنة',
    'مبنى العناية المركزة',
    'مبنى المختبرات',
    'مبنى الإدارة'
  ];

  // Device names
  const deviceNames = ['DeviceA', 'DeviceB', 'DeviceC', 'DeviceD', 'DeviceE'];

  // Generate 20 devices
  for (let i = 1; i <= 20; i++) {
    const serialNumber = 'SN' + (1000 + i);
    const branch = buildingNames[i % buildingNames.length];
    const timezone = 'GMT+3';
    const lastSeen = `2023-10-${(10 + i % 20).toString().padStart(2, '0')} ${8 + (i % 12)}:00`;
    const usersCount = 50 + (i % 10);
    const status = i % 3 === 0 ? 'New' : 'Active';
    const connection = i % 2 === 0 ? 'Connected' : 'Disconnected';
    const attendanceRecords = usersCount * 10;

    // Generate employees for the device
    const employees = this.generateEmployees(usersCount, deviceNames, buildingNames);

    this.devices.push({
      serialNumber,
      branch,
      timezone,
      lastSeen,
      usersCount,
      status,
      connection,
      attendanceRecords,
      employees
    });
  }
  
    // Initially, all devices and fingerprints are in the filtered list
    this.filteredDevices = this.devices;
    this.filteredFingerprints = this.fingerprints;
  // Devices Overview Filters
  (document.getElementById('applyFilters') as any).addEventListener('click', () => {
    const serialSearch = (document.getElementById('serialSearch') as any).value.toLowerCase();
    const statusFilter = (document.getElementById('statusFilter') as any).value;
    const connectionFilter = (document.getElementById('connectionFilter') as any).value;
    
    this.filteredDevices = this.devices.filter(device => {
      
  
      const matchesSerial = device.serialNumber.toLowerCase().includes(serialSearch);
      const matchesStatus = statusFilter ? device.status === statusFilter : true;
      const matchesConnection = connectionFilter ? device.connection === connectionFilter : true;
      return matchesSerial && matchesStatus && matchesConnection;
    });
    
  
    this.currentDevicesPage = 1;
    
  
    this.populateDevicesTable(this.currentDevicesPage);
  });
  (document.getElementById('resetFilters') as any).addEventListener('click', () => {
    (document.getElementById('serialSearch') as any).value = '';
    (document.getElementById('statusFilter') as any).value = '';
    (document.getElementById('connectionFilter') as any).value = '';
  
    this.filteredDevices = this.devices;
    this.currentDevicesPage = 1;
    this.populateDevicesTable(this.currentDevicesPage);
  });

  // Employee Search
  (document.getElementById('searchEmployeesButton') as any).addEventListener('click', () => {
    const searchTerm = (document.getElementById('employeeSearch')as any).value.toLowerCase();

    this.filteredEmployees = this.currentDeviceEmployees.filter(employee => {
      return (
        employee.code.toLowerCase().includes(searchTerm) ||
        employee.employeeId.toLowerCase().includes(searchTerm) ||
        employee.name.toLowerCase().includes(searchTerm)
      );
    });
  
    this.currentUsersPage = 1;
    this.populateUsersTable(this.currentUsersPage);
  });
  (document.getElementById('resetEmployeeSearchButton') as any).addEventListener('click', () => {
    (document.getElementById('employeeSearch')as any).value = '';
    this.filteredEmployees = this.currentDeviceEmployees;
    this.currentUsersPage = 1;
    this.populateUsersTable(this.currentUsersPage);
  });

  // Fingerprints Filters
  (document.getElementById('applyFingerprintFilters') as any).addEventListener('click', () => {
    const startDateInput = (document.getElementById('startDate')as any).value;
    const endDateInput = (document.getElementById('endDate')as any).value;
  
    let startDate = startDateInput ? new Date(startDateInput) : null;
    let endDate = endDateInput ? new Date(endDateInput) : null;
  
    this.filteredFingerprints = this.fingerprints.filter(fp => {
      const enrolledDate = new Date(fp.captureDate + ' ' + fp.captureTime);
      const afterStartDate = startDate ? enrolledDate >= startDate : true;
      const beforeEndDate = endDate ? enrolledDate <= endDate : true;
  
      const matchesEmployee = this.currentEmployeeCode ? fp.employeeCode === this.currentEmployeeCode : true;
  
      return afterStartDate && beforeEndDate && matchesEmployee;
    });
  
    this.currentFingerprintsPage = 1;
    this.populateFingerprintsTable(this.currentFingerprintsPage);
  });
  (document.getElementById('resetFingerprintFilters') as any).addEventListener('click', () => {
    (document.getElementById('startDate')as any).value = '';
    (document.getElementById('endDate')as any).value = '';
  
    this.filteredFingerprints = this.fingerprints.filter(fp => {
      return this.currentEmployeeCode ? fp.employeeCode === this.currentEmployeeCode : true;
    });
    this.currentFingerprintsPage = 1;
    this.populateFingerprintsTable(this.currentFingerprintsPage);
  });
  // Generate fingerprints
  this.generateFingerprints();


}

//  to generate employees with Arabic names
 generateEmployees(n, deviceNames, buildingNames) {
  const firstNames = ['أحمد', 'محمد', 'سارة', 'ليلى', 'خالد', 'ندى', 'عمر', 'فاطمة', 'يوسف', 'منى', 'حسين', 'رنا'];
  const middleNames = ['علي', 'حسن', 'إبراهيم', 'محمود', 'مصطفى', 'أحمد', 'يوسف', 'علي', 'محمد', 'خالد', 'أحمد', 'سعيد'];
  const lastNames1 = ['عبدالله', 'عبدالرحمن', 'سليمان', 'صبري', 'زكي', 'منصور', 'عبدالعزيز', 'المغربي', 'الدسوقي', 'الشافعي', 'الزيني', 'الهواري'];
  const lastNames2 = ['حسن', 'سعيد', 'عبداللطيف', 'مرسي', 'سالم', 'فتحي', 'سامي', 'عبدالغني', 'الأنصاري', 'الصاوي', 'الغندور', 'العربي'];

  const employees:any[] = [];
  for (let i = 1; i <= n; i++) {
    const code = 'E' + (100000 + i);
    const employeeId = 'EMP' + (100000 + i);
    const name =
      firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' +
      middleNames[Math.floor(Math.random() * middleNames.length)] + ' ' +
      lastNames1[Math.floor(Math.random() * lastNames1.length)] + ' ' +
      lastNames2[Math.floor(Math.random() * lastNames2.length)];
    const pri = 'User';
    const password = '******';
    const fingerprintsCount = 20; // Each employee has at least 20 fingerprints
    const status = 'Active';

    employees.push({
      code,
      employeeId,
      name,
      pri,
      password,
      fingerprintsCount,
      status,
    });
  }
  return employees;
}

//  to generate fingerprints for all employees
 generateFingerprints() {
  this.fingerprints = [];
  let fingerprintIdCounter = 1;

  this.devices.forEach(device => {
    device.employees.forEach(employee => {
      // Each employee has at least 20 fingerprints
      for (let j = 0; j < 20; j++) {
        const captureDateTime = new Date(2023, 9, Math.floor(Math.random() * 30) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
        this.fingerprints.push({
          fingerprintId: fingerprintIdCounter++,
          employeeCode: employee.code,
          employeeName: employee.name,
          captureDate: captureDateTime.toLocaleDateString(),
          captureTime: captureDateTime.toLocaleTimeString(),
          captureDevice: device.serialNumber,
          captureBuilding: device.branch,
          notes: 'No issues',
        });
      }
    });
  });
}

//  to populate the devices table with pagination
populateDevicesTable(page = 1) {
  const tableBody: any = document.querySelector('#devicesTable tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  this.totalDevicesPages = Math.ceil(this.filteredDevices.length / this.devicesPerPage);

  const startIndex = (page - 1) * this.devicesPerPage;
  const endIndex = startIndex + this.devicesPerPage;
  const paginatedDevices = this.filteredDevices.slice(startIndex, endIndex);

  paginatedDevices.forEach(device => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${device.serialNumber}</td>
      <td>${device.branch}</td>
      <td>${device.timezone}</td>
      <td>${device.lastSeen}</td>
      <td>${device.usersCount}</td>
      <td><span class="badge ${device.status.toLowerCase()}">${device.status}</span></td>
      <td><span class="status ${device.connection.toLowerCase()}">${device.connection}</span></td>
      <td>
        <button class="btn-action edit-btn">Edit</button>
        <button class="btn-action delete-btn">Delete</button>
      </td>
    `;

    // Attach event listeners manually in Angular
    (row.querySelector('.edit-btn')as any).addEventListener('click', () => {
      this.openDeviceDetails(device.serialNumber);
    });

    (row.querySelector('.delete-btn')as any).addEventListener('click', () => {
      this.deleteDevice(device.serialNumber);
    });

    tableBody.appendChild(row);
  });

  this.currentDevicesPage = page;
  this.updateDevicesPagination();
}

//  to update the devices pagination controls
 updateDevicesPagination() {
  const paginationDiv:any = document.getElementById('devicesPagination');
  paginationDiv.innerHTML = '';

  // Previous Page Button
  const prevButton = document.createElement('button');
  prevButton.className = 'btn';
  prevButton.textContent = 'Previous';
  prevButton.disabled = this.currentDevicesPage === 1;
  prevButton.onclick =  () => {
    this.populateDevicesTable(this.currentDevicesPage - 1);
  };
  paginationDiv.appendChild(prevButton);

  // Page Numbers
  for (let i = 1; i <= this.totalDevicesPages; i++) {
    const pageButton:any = document.createElement('button');
    pageButton.className = 'btn page-number';
    if (i === this.currentDevicesPage) {
      pageButton.classList.add('active');
    }
    pageButton.textContent = i;
    pageButton.onclick =  () => {
      this.populateDevicesTable(i);
    };
    paginationDiv.appendChild(pageButton);
  }

  // Next Page Button
  const nextButton = document.createElement('button');
  nextButton.className = 'btn';
  nextButton.textContent = 'Next';
  nextButton.disabled = this.currentDevicesPage === this.totalDevicesPages;
  nextButton.onclick =  () => {
    this.populateDevicesTable(this.currentDevicesPage + 1);
  };
  paginationDiv.appendChild(nextButton);
}

//  to apply filters in the Devices Overview tab


//  to reset filters in the Devices Overview tab


//  to open device details
 openDeviceDetails(serialNumber) {
  
  // Switch to the Device Details tab
  const tabLinks:any = document.getElementsByClassName('tab-link');
  for (let link of tabLinks) {
    link.className = link.className.replace(' active', '');
  }
  (document.querySelector('.tab-link:nth-child(2)') as any).className += ' active';

  // Hide all tab content
  const tabContents:any = document.getElementsByClassName('tab-content');
  for (let content of tabContents) {
    content.style.display = 'none';
  }
  (document.getElementById('DeviceDetails') as any).style.display = 'block';

  // Find the device data
  const device = this.devices.find(d => d.serialNumber === serialNumber);

  // Update device details
  (document.getElementById('detailSerialNumber') as any).textContent = device.serialNumber;
  (document.getElementById('detailBranch') as any).textContent = device.branch;
  (document.getElementById('detailLastSeen') as any).textContent = device.lastSeen;
  (document.getElementById('detailTimezone') as any).textContent = device.timezone;
  (document.getElementById('detailUsersCount') as any).textContent = device.usersCount;
  (document.getElementById('detailAttendanceRecords') as any).textContent = device.attendanceRecords;
  (document.getElementById('detailStatus') as any).innerHTML = `<span class="badge ${device.status.toLowerCase()}">${device.status}</span>`;
  (document.getElementById('detailConnection') as any).innerHTML = `<span class="status ${device.connection.toLowerCase()}">${device.connection}</span>`;

  // Populate the users table
  this.currentDeviceEmployees = device.employees;
  this.filteredEmployees = this.currentDeviceEmployees;
  this.populateUsersTable(1);
}

//  to populate the users table with pagination
 populateUsersTable(page = 1) {
  const tableBody:any = document.getElementById('usersTableBody');
  tableBody.innerHTML = ''; // Clear existing rows

  this.totalUsersPages = Math.ceil(this.filteredEmployees.length / this.employeesPerPage);

  const startIndex = (page - 1) * this.employeesPerPage;
  const endIndex = startIndex + this.employeesPerPage;
  const paginatedUsers = this.filteredEmployees.slice(startIndex, endIndex);

  paginatedUsers.forEach(user => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${user.code}</td>
      <td>${user.employeeId}</td>
      <td>${user.name}</td>
      <td>${user.pri}</td>
      <td>${user.password}</td>
      <td><a href="#" onclick="openFingerprints('${user.code}'); return false;">${user.fingerprintsCount}</a></td>
      <td><span class="badge ${user.status.toLowerCase()}">${user.status}</span></td>
      <td>
        <button class="btn-action" onclick="editUser('${user.code}')">Edit</button>
        <button class="btn-action" onclick="deleteUser('${user.code}')">Delete</button>
        <button class="btn-action" onclick="syncUser('${user.code}')">Sync with All Devices</button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  this.currentUsersPage = page;
  this.updateUsersPagination();
}

//  to update the users pagination controls
 updateUsersPagination() {
  const paginationDiv:any = document.getElementById('usersPagination');
  paginationDiv.innerHTML = '';

  // Previous Page Button
  const prevButton = document.createElement('button');
  prevButton.className = 'btn';
  prevButton.textContent = 'Previous';
  prevButton.disabled = this.currentUsersPage === 1;
  prevButton.onclick =  () => {
    this.populateUsersTable(this.currentUsersPage - 1);
  };
  paginationDiv.appendChild(prevButton);

  // Page Numbers
  for (let i = 1; i <= this.totalUsersPages; i++) {
    const pageButton:any = document.createElement('button');
    pageButton.className = 'btn page-number';
    if (i === this.currentUsersPage) {
      pageButton.classList.add('active');
    }
    pageButton.textContent = i;
    pageButton.onclick =  () => {
      this.populateUsersTable(i);
    };
    paginationDiv.appendChild(pageButton);
  }

  // Next Page Button
  const nextButton = document.createElement('button');
  nextButton.className = 'btn';
  nextButton.textContent = 'Next';
  nextButton.disabled = this.currentUsersPage === this.totalUsersPages;
  nextButton.onclick =  () => {
    this.populateUsersTable(this.currentUsersPage + 1);
  };
  paginationDiv.appendChild(nextButton);
}





//  to open fingerprints tab and display details for a specific employee
 openFingerprints(employeeCode) {
  this.currentEmployeeCode = employeeCode;

  // Filter fingerprints for the selected employee
  this.filteredFingerprints = this.fingerprints.filter(fp => fp.employeeCode === employeeCode);
  this.currentFingerprintsPage = 1;
  this.populateFingerprintsTable(this.currentFingerprintsPage);

  // Switch to the Fingerprints tab
  const tabLinks:any = document.getElementsByClassName('tab-link');
  for (let link of tabLinks) {
    link.className = link.className.replace(' active', '');
  }
  (document.querySelector('.tab-link:nth-child(3)')as any).className += ' active';

  // Hide all tab content
  const tabContents:any = document.getElementsByClassName('tab-content');
  for (let content of tabContents) {
    content.style.display = 'none';
  }
  (document.getElementById('Fingerprints')as any).style.display = 'block';
}

//  to populate fingerprints table with pagination
populateFingerprintsTable(page = 1) {
  const tableBody: any = document.getElementById('fingerprintsTableBody');
  tableBody.innerHTML = ''; // Clear existing rows

  this.totalFingerprintsPages = Math.ceil(this.filteredFingerprints.length / this.fingerprintsPerPage);
  
  const startIndex = (page - 1) * this.fingerprintsPerPage;
  const endIndex = startIndex + this.fingerprintsPerPage;
  const paginatedFingerprints = this.filteredFingerprints.slice(startIndex, endIndex);

  paginatedFingerprints.forEach(fp => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${fp.fingerprintId}</td>
      <td>${fp.employeeCode}</td>
      <td>${fp.employeeName}</td>
      <td>${fp.captureDate}</td>
      <td>${fp.captureTime}</td>
      <td>${fp.captureDevice}</td>
      <td>${fp.captureBuilding}</td>
      <td>${fp.notes}</td>
      <td class="table-actions">
        <button class="btn-action edit-btn">Edit</button>
        <button class="btn-action delete-btn">Delete</button>
      </td>
    `;

    // Attach event listeners manually in Angular
    (row.querySelector('.edit-btn')as any).addEventListener('click', () => {
      this.editFingerprint(fp.fingerprintId);
    });

    (row.querySelector('.delete-btn')as any).addEventListener('click', () => {
      this.deleteFingerprint(fp.fingerprintId);
    });

    tableBody.appendChild(row);
  });

  this.currentFingerprintsPage = page;
  this.updateFingerprintsPagination();
}

//  to update fingerprints pagination controls
updateFingerprintsPagination() {
  const paginationDiv: any = document.getElementById('fingerprintsPagination');
  paginationDiv.innerHTML = '';

  const maxVisiblePages = 10; // عدد الصفحات المرئية في كل مرة
  const startPage = Math.max(1, this.currentFingerprintsPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(this.totalFingerprintsPages, startPage + maxVisiblePages - 1);

  // Previous Page Button
  const prevButton = document.createElement('button');
  prevButton.className = 'btn';
  prevButton.textContent = 'Previous';
  prevButton.disabled = this.currentFingerprintsPage === 1;
  prevButton.onclick = () => {
    this.populateFingerprintsTable(this.currentFingerprintsPage - 1);
  };
  paginationDiv.appendChild(prevButton);

  // First Page Button
  if (startPage > 1) {
    const firstButton = document.createElement('button');
    firstButton.className = 'btn page-number';
    firstButton.textContent = '1';
    firstButton.onclick = () => {
      this.populateFingerprintsTable(1);
    };
    paginationDiv.appendChild(firstButton);

    // Ellipsis for hidden pages
    const dots = document.createElement('span');
    dots.className = 'dots';
    dots.textContent = '...';
    paginationDiv.appendChild(dots);
  }

  // Page Numbers
  for (let i = startPage; i <= endPage; i++) {
    const pageButton: any = document.createElement('button');
    pageButton.className = 'btn page-number';
    if (i === this.currentFingerprintsPage) {
      pageButton.classList.add('active');
    }
    pageButton.textContent = i;
    pageButton.onclick = () => {
      this.populateFingerprintsTable(i);
    };
    paginationDiv.appendChild(pageButton);
  }

  // Last Page Button
  if (endPage < this.totalFingerprintsPages) {
    const dots = document.createElement('span');
    dots.className = 'dots';
    dots.textContent = '...';
    paginationDiv.appendChild(dots);

    const lastButton:any = document.createElement('button');
    lastButton.className = 'btn page-number';
    lastButton.textContent = this.totalFingerprintsPages;
    lastButton.onclick = () => {
      this.populateFingerprintsTable(this.totalFingerprintsPages);
    };
    paginationDiv.appendChild(lastButton);
  }

  // Next Page Button
  const nextButton = document.createElement('button');
  nextButton.className = 'btn';
  nextButton.textContent = 'Next';
  nextButton.disabled = this.currentFingerprintsPage === this.totalFingerprintsPages;
  nextButton.onclick = () => {
    this.populateFingerprintsTable(this.currentFingerprintsPage + 1);
  };
  paginationDiv.appendChild(nextButton);
}





// Device Management s
 reloadSettings() {
  alert('Reloading settings...');
}

 unlockDoor() {
  alert('Unlocking door...');
}

 restartDevice() {
  alert('Restarting device...');
}

// User Management s
 checkNewUsers() {
  alert('Checking for new users...');
}

 downloadAllUsers() {
  alert('Downloading all users...');
}

 uploadAllUsers() {
  alert('Uploading all users...');
}

 deleteAllUsers() {
  if (confirm('Are you sure you want to delete all users?')) {
    alert('All users deleted.');
    // Implement deletion logic here
  }
}

 editUser(userCode) {
  alert('Editing user ' + userCode);
  // Implement edit logic here
}

 deleteUser(userCode) {
  if (confirm('Are you sure you want to delete user ' + userCode + '?')) {
    alert('User ' + userCode + ' deleted.');
    // Implement deletion logic here
  }
}

 syncUser(userCode) {
  alert('Syncing user ' + userCode + ' with all devices.');
  // Implement sync logic here
}

 deleteDevice(serialNumber) {
  if (confirm('Are you sure you want to delete device ' + serialNumber + '?')) {
    alert('Device ' + serialNumber + ' deleted.');
    // Implement deletion logic here
  }
}

// Fingerprint Management s
 addFingerprint() {
  alert('Add Fingerprint ality to be implemented.');
  // Implement the logic to add a new fingerprint
}

 editFingerprint(fingerprintId) {
  alert('Edit Fingerprint ' + fingerprintId);
  // Implement the logic to edit the fingerprint
}

 deleteFingerprint(fingerprintId) {
  if (confirm('Are you sure you want to delete fingerprint ' + fingerprintId + '?')) {
    alert('Fingerprint ' + fingerprintId + ' deleted.');
    // Implement the logic to delete the fingerprint
  }
}

//  to switch between main tabs
 openTab(event:any, tabName:any) {
  // Hide all tab content
  const tabContents:any = document.getElementsByClassName('tab-content');
  for (let content of tabContents) {
    content.style.display = 'none';
  }

  // Remove active class from all tab links
  const tabLinks:any = document.getElementsByClassName('tab-link');
  for (let link of tabLinks) {
    link.className = link.className.replace(' active', '');
  }

  // Show the current tab and add active class to the tab link
  (document.getElementById(tabName) as any).style.display = 'block';
  
  event.currentTarget.className += ' active';

  if (tabName === 'DevicesOverview') {
    this.populateDevicesTable(this.currentDevicesPage);
  } else if (tabName === 'Fingerprints') {
    // Reset currentEmployeeCode to show all fingerprints
    this.currentEmployeeCode = null;
    this.filteredFingerprints = this.fingerprints;
    this.currentFingerprintsPage = 1;
    this.populateFingerprintsTable(this.currentFingerprintsPage);
  }
}


}
