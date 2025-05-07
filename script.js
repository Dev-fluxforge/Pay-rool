    const departments = {
        "1": "Personnel",
    "2": "Marketing",
    "3": "Manufacturing",
    "4": "Computer Services",
    "5": "Sales",
    "6": "Accounting",
    "7": "Shipping"
    };

    // Store employee data
    let employees = [];

    // DOM Elements
    const employeeForm = document.getElementById('employeeForm');
    const employeeIdInput = document.getElementById('employeeId');
    const departmentSelect = document.getElementById('department');
    const hourlySalaryInput = document.getElementById('hourlySalary');
    const hoursWorkedInput = document.getElementById('hoursWorked');
    const calculateBtn = document.getElementById('calculateBtn');
    const errorDiv = document.getElementById('error');
    const employeeList = document.getElementById('employeeList');
    const employeeItems = document.getElementById('employeeItems');
    const resultsSection = document.getElementById('resultsSection');
    const resultsBody = document.getElementById('resultsBody');
    const totalEmployees = document.getElementById('totalEmployees');
    const totalHours = document.getElementById('totalHours');
    const totalPayroll = document.getElementById('totalPayroll');
    const printBtn = document.getElementById('printBtn');

    // Add employee to the list
    employeeForm.addEventListener('submit', function(e) {
        e.preventDefault();

    // Get form values
    const employeeId = employeeIdInput.value.trim();
    const department = departmentSelect.value;
    const hourlySalary = parseFloat(hourlySalaryInput.value);
    const hoursWorked = parseFloat(hoursWorkedInput.value);

    // Basic validation
    if (!employeeId || !department || isNaN(hourlySalary) || isNaN(hoursWorked)) {
        showError('Please fill all fields with valid values.');
    return;
    }

      // Check if employee ID already exists
    if (employees.some(emp => emp.id === employeeId)) {
        showError('Employee ID already exists. Please use a unique ID.');
    return;
    }

    // Add employee to array
    const employee = {
        id: employeeId,
    department: department,
    departmentName: departments[department],
    hourlySalary: hourlySalary,
    hoursWorked: hoursWorked
    };

    employees.push(employee);

    // Clear form
    employeeIdInput.value = '';
    hourlySalaryInput.value = '';
    hoursWorkedInput.value = '';
    employeeIdInput.focus();

    // Clear error if any
    hideError();

    // Update employee list display
    updateEmployeeList();

    // Show employee list if not already visible
    employeeList.classList.remove('hidden');
    });

    // Generate report
    calculateBtn.addEventListener('click', function() {
        if (employees.length === 0) {
        showError('Please add at least one employee to generate the report.');
    return;
        }

    // Clear any previous results
    resultsBody.innerHTML = '';

    // Group employees by department and calculate totals
    const departmentTotals = calculateDepartmentTotals();

    // Sort departments by department number
    const sortedDepartments = Object.keys(departmentTotals).sort();

    // Calculate grand totals
    let grandTotalEmployees = 0;
    let grandTotalHours = 0;
    let grandTotalPayroll = 0;

      // Populate the results table
    sortedDepartments.forEach(deptNum => {
        const dept = departmentTotals[deptNum];
    const row = document.createElement('tr');
    row.classList.add('department-totals');

    row.innerHTML = `
    <td>${deptNum}</td>
    <td>${departments[deptNum]}</td>
    <td>${dept.employees}</td>
    <td>${dept.hours.toFixed(1)}</td>
    <td>$${dept.payroll.toFixed(2)}</td>
    `;

    resultsBody.appendChild(row);

    // Add to grand totals
    grandTotalEmployees += dept.employees;
    grandTotalHours += dept.hours;
    grandTotalPayroll += dept.payroll;
    });

    // Update totals in the footer
    totalEmployees.textContent = grandTotalEmployees;
    totalHours.textContent = grandTotalHours.toFixed(1);
    totalPayroll.textContent = '$' + grandTotalPayroll.toFixed(2);

    // Show results section
    resultsSection.classList.remove('hidden');
    });

    // Handle print button
    printBtn.addEventListener('click', function() {
        window.print();
    });

    // Delete employee
    function deleteEmployee(id) {
        employees = employees.filter(emp => emp.id !== id);
    updateEmployeeList();

    if (employees.length === 0) {
        employeeList.classList.add('hidden');
        }
    }   

    // Update employee list display
    function updateEmployeeList() {
        employeeItems.innerHTML = '';
        
        employees.forEach(emp => {
        const item = document.createElement('div');
    item.className = 'employee-item';

    item.innerHTML = `
    <div class="employee-details">
        ID: <strong>${emp.id}</strong> |
        Dept: <strong>${emp.department} - ${emp.departmentName}</strong> |
        Rate: <strong>$${emp.hourlySalary.toFixed(2)}</strong> |
        Hours: <strong>${emp.hoursWorked.toFixed(1)}</strong>
    </div>
    <button class="delete-btn" onclick="deleteEmployee('${emp.id}')">Remove</button>
    `;

    employeeItems.appendChild(item);
        });
    }

    // Calculate department totals
    function calculateDepartmentTotals() {
        const departmentTotals = { };

    // Initialize totals for all departments (even empty ones)
    for (const deptNum in departments) {
        departmentTotals[deptNum] = {
            employees: 0,
            hours: 0,
            payroll: 0
        };
        }

      // Calculate totals for departments with employees
        employees.forEach(emp => {
        const deptNum = emp.department;
    const dept = departmentTotals[deptNum];

    dept.employees++;
    dept.hours += emp.hoursWorked;
    dept.payroll += emp.hourlySalary * emp.hoursWorked;
        });

    return departmentTotals;
    }

    // Show error message
    function showError(message) {
        errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    }

    // Hide error message
    function hideError() {
        errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
    }

    // Make the deleteEmployee function available globally
    window.deleteEmployee = deleteEmployee;
