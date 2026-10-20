import { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark app-navbar">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">PeopleDesk</NavLink>
        <div className="navbar-nav ms-auto flex-row gap-2">
          <NavLink end className={({ isActive }) => `nav-link px-3 ${isActive ? 'active-link' : ''}`} to="/">Home</NavLink>
          <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'active-link' : ''}`} to="/employee-form">Employee Form</NavLink>
        </div>
      </div>
    </nav>
  );
}

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        if (!response.ok) throw new Error('Unable to retrieve employee data.');
        return response.json();
      })
      .then((data) => setEmployees(data))
      .catch(() => setError('Could not load the data. Check your internet connection and refresh the page.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="container page-container">
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Employee Dashboard</h1>
          <p className="text-secondary mb-0">View employee contact information from the external API.</p>
        </div>
        <div className="employee-count">
          <span className="count-number">{employees.length}</span>
          <span className="count-label">Employees</span>
        </div>
      </div>

      <section className="content-card">
        <div className="card-heading">
          <div>
            <h2>Employee Directory</h2>
            <p className="text-secondary mb-0">ID, name and email address</p>
          </div>
          <span className="api-badge"><span className="status-dot"></span> API connected</span>
        </div>

        {loading && <div className="loading-state"><div className="spinner-border spinner-border-sm me-2" role="status"></div>Loading employees...</div>}
        {error && <div className="alert alert-danger m-3">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table employee-table align-middle mb-0">
              <thead><tr><th>ID</th><th>Employee Name</th><th>Email Address</th></tr></thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td><span className="id-chip">{String(employee.id).padStart(2, '0')}</span></td>
                    <td><div className="employee-name">{employee.name}</div></td>
                    <td><a className="email-link" href={`mailto:${employee.email}`}>{employee.email}</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="table-footer">Data source: JSONPlaceholder Users API</div>
      </section>
    </main>
  );
}

function EmployeeForm() {
  const [form, setForm] = useState({ name: '', designation: '', location: '', salary: '' });
  const [message, setMessage] = useState('');

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setMessage('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage('Form validation successful. No data was submitted, as required by the assignment.');
  }

  return (
    <main className="container page-container form-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">EMPLOYEE MANAGEMENT</p>
          <h1>Employee Form</h1>
          <p className="text-secondary mb-0">Enter the employee details below.</p>
        </div>
        <div className="form-icon"><span>＋</span></div>
      </div>

      <section className="content-card form-card">
        <div className="card-heading">
          <div>
            <h2>Employee Information</h2>
            <p className="text-secondary mb-0">All fields are required.</p>
          </div>
        </div>
        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">Name</label>
              <input id="name" name="name" className="form-control" placeholder="Enter full name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label htmlFor="designation" className="form-label">Designation</label>
              <input id="designation" name="designation" className="form-control" placeholder="e.g. Software Engineer" value={form.designation} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label htmlFor="location" className="form-label">Location</label>
              <input id="location" name="location" className="form-control" placeholder="Enter city or office location" value={form.location} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label htmlFor="salary" className="form-label">Salary (₹)</label>
              <input id="salary" name="salary" type="number" min="0" className="form-control" placeholder="Enter salary" value={form.salary} onChange={handleChange} required />
            </div>
          </div>
          {message && <div className="alert alert-success mt-4 mb-0" role="status">{message}</div>}
          <div className="form-actions">
            <button type="reset" className="btn btn-light reset-btn" onClick={() => { setForm({ name: '', designation: '', location: '', salary: '' }); setMessage(''); }}>Clear Form</button>
            <button type="submit" className="btn btn-primary submit-btn">Validate Details <span aria-hidden="true">→</span></button>
          </div>
          <p className="form-note">Demo form only — details are not sent to a server or saved.</p>
        </form>
      </section>
    </main>
  );
}

export default function App() {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employee-form" element={<EmployeeForm />} />
        <Route path="*" element={<main className="container page-container"><h1>Page not found</h1><p>Use the navigation bar to return Home.</p></main>} />
      </Routes>
      <footer className="app-footer">PeopleDesk <span>·</span> React Employee Dashboard</footer>
    </>
  );
}