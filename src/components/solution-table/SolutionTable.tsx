import { Solution } from "@/utils/types";
import { Table } from "antd";

interface SolutionTableProps {
  data: Solution;
}

const SolutionTable = ({ data }: SolutionTableProps) => {
  const columns = [
    {
      title: 'Field',
      dataIndex: 'field',
      key: 'field',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const tableData = Object.entries(data).map(([key, value]) => ({
    key,
    field: key.replace(/_/g, ' ').toUpperCase(),
    value: String(value),
  }));

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      pagination={false}
      bordered
      size="small"
    />
  );
}

export default SolutionTable