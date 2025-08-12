import React, { useRef } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import api from '../api';

export default function ImportExportButtons({ onImported }) {
  const fileRef = useRef();

  const onImportClick = () => fileRef.current?.click();

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    const res = await api.post('/products/import', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert(`Added: ${res.data.added}, Skipped: ${res.data.skipped}`);
    onImported?.(res.data.duplicates || []);
    e.target.value = '';
  };

  const onExport = () => {
    const url = (api.defaults.baseURL || '') + '/products/export';
    window.location.href = url;
  };

  return (
    <>
      <input type="file" accept=".csv" ref={fileRef} className="d-none" onChange={onFileChange} />
      <ButtonGroup>
        <Button variant="secondary" onClick={onImportClick}>Import</Button>
        <Button variant="success" onClick={onExport}>Export</Button>
      </ButtonGroup>
    </>
  );
}
