// frontend/src/components/DrugTable.jsx
import React, { useEffect, useState } from 'react';
import { fetchConfig, fetchCompanies, fetchDrugs } from '../App';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  MenuItem, Select, FormControl, InputLabel, Button
} from '@mui/material';

export default function DrugTable() {
  const [config, setConfig] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [drugs, setDrugs] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(()=> {
    fetchConfig().then(setConfig);
    fetchCompanies().then(setCompanies);
    loadData();
  }, []);

  async function loadData(company = '') {
    const { rows, total } = await fetchDrugs({ company, limit: 500 });
    setDrugs(rows || []);
    setTotal(total || 0);
  }

  function onSelectCompany(e) {
    const value = e.target.value;
    setSelectedCompany(value);
    loadData(value);
  }

  function onCompanyClick(company) {
    setSelectedCompany(company);
    loadData(company);
  }

  const columns = config?.columns ?? [
    { key: 'id', label: 'Id' },
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'company', label: 'Company' },
    { key: 'launchDate', label: 'Launch Date' }
  ];

  return (
    <div>
      <FormControl style={{ minWidth: 300, marginBottom: 16 }}>
        <InputLabel id="company-label">Company</InputLabel>
        <Select
          labelId="company-label"
          value={selectedCompany}
          label="Company"
          onChange={onSelectCompany}
        >
          <MenuItem value="">All companies</MenuItem>
          {companies.map(c =>
            <MenuItem key={c} value={c}>{c}</MenuItem>
          )}
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(col => <TableCell key={col.key}>{col.label}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {drugs.map((d, index) => {
              const rowIndex = index + 1; // local index (1..n)
              const name = d.genericName ? `${d.genericName}${d.brandName ? ` (${d.brandName})` : ''}` : d.brandName;
              const launchStr = d.launchDate ? new Date(d.launchDate).toLocaleDateString() : '';
              return (
                <TableRow key={d._id || `${d.code}-${index}`}>
                  {columns.map(col => {
                    if (col.key === 'id') return <TableCell key="id">{rowIndex}</TableCell>;
                    if (col.key === 'code') return <TableCell key="code">{d.code}</TableCell>;
                    if (col.key === 'name') return <TableCell key="name">{name}</TableCell>;
                    if (col.key === 'company') return (
                      <TableCell key="company">
                        <Button onClick={()=> onCompanyClick(d.company)}>{d.company}</Button>
                      </TableCell>
                    );
                    if (col.key === 'launchDate') return <TableCell key="launchDate">{launchStr}</TableCell>;
                    return <TableCell key={col.key}>{d[col.key]}</TableCell>;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: 8 }}>Total results: {total}</div>
    </div>
  );
}
