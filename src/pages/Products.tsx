import { apiService } from '@app/services/apiService';
import React, { useState, useEffect } from 'react';
import { Button, CardHeader, ListGroup, ListGroupItem, Media } from 'reactstrap';
import { Spinner,CustomInput } from "reactstrap";
import { Card, CardBody, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';


interface ProductImage {
  productImageId: string;
  productId: string;
  imageUrl: string;
}

interface Product {
  productId: string;
  name: string;
  category: string;
  price: number;
  tag: string;
  status: string | null;
  tags: string[];
  images: ProductImage[];
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  // Fetch products from your API
  useEffect(() => {
    setLoading(true); // Show the spinner
    apiService({
      method: "GET",
      url: "https://sacnsommasterdataservice.azurewebsites.net/api/Products/GetAll",
    })
      .then((response) => {
        console.log(response.data); // Log the data
        setProducts(response.data.data);
        setLoading(false); // Hide the spinner
      })
      .catch((error) => console.error(error));
  }, [refreshKey]);

  return (
    <Card>
        <CardHeader>
        <Button color="primary"  style={{ float: "right" }}>Create Product</Button>
        </CardHeader>
      <CardBody>
        <Table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Tag</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td>
                  {product.images[0] && (
                    <img src={product.images[0].imageUrl} alt="Product" width="50" height="50" />
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>{product.tag}</td>
                <td>
                <td>
                <FontAwesomeIcon icon={faEdit}  style={{ color: "green", marginRight: "10px" }} onClick={() => handleEdit(product.productId)} /> | &nbsp;
                <FontAwesomeIcon icon={faTrash}  style={{ color: "darkred", marginRight: "10px" }} onClick={() => handleDelete(product.productId)} /> | &nbsp;
                <FontAwesomeIcon icon={faUpload}  style={{ color: "purple", marginRight: "10px" }} onClick={() => handleUploadImage(product.productId)} />
              </td>
              </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};


function handleEdit(productId: string) {
    // Implement your edit logic here
  }
  
  function handleDelete(productId: string) {
    // Implement your delete logic here
  }
  
  function handleUploadImage(productId: string) {
    // Implement your upload image logic here
  }

export default Products;