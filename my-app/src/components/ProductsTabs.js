import React, { useEffect, useState } from 'react';
import { ConfigProvider, Tabs, Card } from 'antd';
import { Row, Col, Button, Switch } from 'antd';
import { SearchOutlined, LinkOutlined, FileTextOutlined, CalculatorOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

import ProductTable from './ProductTable';

const ProductsTabs = () => {
  const [products, setProducts] = useState([]);
  const [providers, setProviders] = useState([]);
  const [providerPrice, setProviderPrice] = useState([]);
  const [error, setError] = useState(null);
  const [isSwitchChecked, setIsSwitchChecked] = useState(false);


  useEffect(() => {
    fetch('https://dummyjson.com/c/1c70-7ac1-4234-b47d')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data.products);
        setProviders(data.providers || []);
        setProviderPrice(data.providersPriceDetails || []);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);


  if (error) {
    return <p>Error: {error}</p>;
  }

  if (products.length === 0) {
    return <p>Loading...</p>;
  }

  const handleSwitchChange = (checked) => {
    console.log('Switch toggled:', checked); 
    setIsSwitchChecked(checked);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(providers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    XLSX.writeFile(workbook, 'Products.xlsx');
  };



  return (
    <ConfigProvider direction="rtl">
      <Card title="تایید قیمت" style={{ direction: 'rtl' }}>
        <Row gutter={[16, 16]} align="middle">

          <Col span={4}>
            <span>نیازسنجی: پروژه بهسازی مرکز داده</span>
          </Col>
          <Col span={4}>
            <span>پروفایل: سازمان جغرافیایی نیروهای مسلح</span>
          </Col>
          <Col span={4}>
            <Button icon={<LinkOutlined />}>جزئیات بیشتر</Button>
          </Col>
          <Col span={4}>
            <Button icon={<FileTextOutlined />}>اسناد درخواست</Button>
          </Col>
          <Col span={4}>
            <Button icon={<SearchOutlined />}>گفتگو</Button>
          </Col>


          <Col span={4}>
            <Switch
              checkedChildren="محاسبه مجموع قیمت"
              unCheckedChildren="محاسبه مجموع قیمت"
              checked={isSwitchChecked}
              onChange={handleSwitchChange}
            />

          </Col>

        </Row>
      </Card>
      <Card className="ant-card">
        <Row justify='end'>
          <Col>
            <Button icon={<CalculatorOutlined />} onClick={exportToExcel}>خروجی تیم تامین</Button>
          </Col>
        </Row>
        <Tabs>
          {products.map((product) => (
            <Tabs.TabPane tab={product.title} key={product.id}>
              <ProductTable
                product={product}
                providers={providers}
                providerPrice={providerPrice}
                showCheckboxes={isSwitchChecked}
              />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Card>
    </ConfigProvider>
  );
};

export default ProductsTabs;
