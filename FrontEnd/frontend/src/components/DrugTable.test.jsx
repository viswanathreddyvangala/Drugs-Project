// frontend/src/components/DrugTable.test.jsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DrugTable from "./DrugTable";

// Mock api calls by mocking fetch globally
const mockConfig = {
  columns: [
    { key: "id", label: "Id" },
    { key: "code", label: "Code" },
    { key: "name", label: "Name" },
    { key: "company", label: "Company" },
    { key: "launchDate", label: "Launch Date" },
  ],
};

const sampleRows = [
  {
    code: "A",
    genericName: "genA",
    brandName: "brandA",
    company: "Company X",
    launchDate: "2024-01-01T00:00:00Z",
  },
  {
    code: "B",
    genericName: "genB",
    brandName: "brandB",
    company: "Company Y",
    launchDate: "2023-01-01T00:00:00Z",
  },
];

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.endsWith("/config"))
      return Promise.resolve({ json: () => Promise.resolve(mockConfig) });
    if (url.endsWith("/companies"))
      return Promise.resolve({
        json: () => Promise.resolve(["Company X", "Company Y"]),
      });
    if (url.includes("/drugs")) {
      // if query has company=Company X
      if (url.includes("company=Company%20X"))
        return Promise.resolve({
          json: () => Promise.resolve({ total: 1, rows: [sampleRows[0]] }),
        });
      return Promise.resolve({
        json: () => Promise.resolve({ total: 2, rows: sampleRows }),
      });
    }
    return Promise.resolve({ json: () => Promise.resolve({}) });
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test("filters by company using dropdown", async () => {
  render(<DrugTable />);

  // wait initial rows loaded
  expect(await screen.findByText("genA (brandA)")).toBeInTheDocument();

  // open select and pick Company X
  const select = screen.getByLabelText("Company");
  fireEvent.mouseDown(select); // open menu (MUI)
  // Because MUI menus render in portal, simplest is to click option by text
  const option = await screen.findByText("Company X");
  fireEvent.click(option);

  // ensure other company's row not present
  expect(screen.queryByText("genB (brandB)")).toBeNull();
});
