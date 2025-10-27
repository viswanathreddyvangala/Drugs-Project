import DrugTable from './components/DrugTable';
import { Container, Typography } from '@mui/material';

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

export async function fetchConfig(){
  const res = await fetch(`${API_BASE}/config`);
  return res.json();
}

export async function fetchCompanies(){
  const res = await fetch(`${API_BASE}/companies`);
  return res.json();
}

export async function fetchDrugs({ company, limit=100, skip=0 } = {}) {
  const params = new URLSearchParams();
  if (company) params.set('company', company);
  params.set('limit', limit);
  params.set('skip', skip);
  const res = await fetch(`${API_BASE}/drugs?${params.toString()}`);
  return res.json();
}



function App() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#1976d2',          
          marginTop: 3,
          marginBottom: 4,
          textTransform: 'uppercase',
          borderBottom: '3px solid #1976d2',
          paddingBottom: '8px',
          letterSpacing: '1px'
        }}>Drug Info</Typography>
      <DrugTable />
    </Container>
  );
}

export default App;