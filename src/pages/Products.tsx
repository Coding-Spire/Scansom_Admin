import { apiService } from '@app/services/apiService';
import React, { useState, useEffect } from 'react';
import { Alert, Button, CardHeader, ListGroup, ListGroupItem, Media } from 'reactstrap';
import { Spinner,CustomInput } from "reactstrap";
import { Card, CardBody, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faImage, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormFeedback  } from 'reactstrap';
import { generateGUID } from '@app/utils/helpers';
import Paginate from 'react-paginate';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
interface ProductImage {
  productImageId: string;
  productId: string;
  imageUrl: string;
}

const ITEMS_PER_PAGE = 10;
interface Product {
  productId: string;
  name: string;
  category: string;
  price: number;
  tag: string;
  status: boolean | null;
  tags: string[];
  images: ProductImage[];
}

interface Category {
  name: string;
  description: string;
  categoryId: string;
  status:boolean;
  featureCategory: boolean;

}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

   // Add state for pagination
   const [currentPage, setCurrentPage] = useState(0);

   // Calculate the range of items for the current page
   const offset = currentPage * ITEMS_PER_PAGE;
 
   // Slice the products array to get only the items for the current page
   const productsOnPage = products.slice(offset, offset + ITEMS_PER_PAGE);
 
   // Calculate the total number of pages
   const pageCount = Math.ceil(products.length / ITEMS_PER_PAGE);
 
   const handlePageClick = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  }
  //file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [product, setProduct] = useState<Product>({
    productId: generateGUID(),
    name: '',
    category: '',
    price: 0,
    tag: '',
    status: true,
    tags: [],
    images: [],
  });

const toggle = () => setUpdateModal(!updateModal);

const toggle1 = () => setCreateModal(!createModal);

async function fetchCategories() {
  try {
    apiService({
      method: "GET",
      url: "https://sacnsommasterdataservice.azurewebsites.net/api/Category",
    })
      .then((response) => {
        console.log(response.data); // Log the data
        setCategories(response.data.data);
         
      })
      .catch((error) => console.error(error));
  } catch (error) {
    // Handle error
  }
}
function handleEdit(productId: string) {
  // Implement your edit logic here
  const selectedProduct: Product | undefined = products.find((product) => product.productId === productId);

  if (selectedProduct) {
    console.log(selectedProduct);
    setProduct(selectedProduct);
    setIsEditMode(true); // Enter edit mode
    setCreateModal(true);
    //toggle() ; // Open the modal
    //setIsEditMode(true); // Enter edit mode
  } else {
    console.log(`Product with id ${productId} not found.`);
  }
}

function handleCreateNew() {
  setProduct({
  productId: generateGUID(),
  name: "",
  category: "",
  price: 0,
  tag: "",
  status: true,
  tags: [],
  images: [],
});
setCreateModal(true);
}

function handleCreate() {
  // Implement your create logic here
  console.log(product);
 
  apiService({
    method: "POST",
    url: "https://sacnsommasterdataservice.azurewebsites.net/api/Products",
    data: product,
  })
    .then((response) => {
      console.log(response.data); // Log the data
      setAlertMessage("Product created successfully!");
      setAlertColor("info");
      toggle1(); // Close the modal
      setRefreshKey((oldKey) => oldKey + 1); // Trigger a refresh
      setTimeout(() => setAlertMessage(""), 2000); // Clear the alert message after 2 seconds
    })
    .catch((error) => {
      console.error(error);
      setAlertMessage("An error occurred while creating the category.");
      setAlertColor("danger");
    });
}

function handleDelete(productId: string) {
  // Implement your delete logic here

 
  
  apiService({
    method: "DELETE",
    url: `https://sacnsommasterdataservice.azurewebsites.net/api/Products/${productId}`,
  })
    .then((response) => {
      console.log(response.data); // Log the data
      setAlertMessage("Product deleted successfully!");
      setAlertColor("info");
      setRefreshKey((oldKey) => oldKey + 1); // Trigger a refresh
      setTimeout(() => setAlertMessage(""), 2000); // Clear the alert message after 2 seconds
    })
    .catch((error) => {
      console.error(error);
      setAlertMessage("An error occurred while deleting the Product.");
      setAlertColor("danger");
    });
}

function updateProduct() {
 
 

  apiService({
    method: "PUT",
    url: "https://sacnsommasterdataservice.azurewebsites.net/api/Products",
    data: product,
  })
    .then((response) => {
      console.log(response.data); // Log the data
      setAlertMessage("Product Updated successfully!");
      setAlertColor("info");
      toggle1(); // Close the modal
      //toggle(); // Close the modal
      setRefreshKey((oldKey) => oldKey + 1); // Trigger a refresh
      setTimeout(() => setAlertMessage(""), 2000); // Clear the alert message after 2 seconds
    })
    .catch((error) => {
      console.error(error);
      setAlertMessage("An error occurred while creating the Product.");
      setAlertColor("danger");
    });
}

function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
  setSelectedFile(event.target.files ? event.target.files[0] : null);
}

function handleUploadImageServer(productId: string) {
  // Implement your upload image logic here
     setSelectedProduct(
    products.find((product) => product.productId === productId) || null
   
  
  );
  console.log(selectedProduct);
  const formData = new FormData();
  if (selectedFile) {
  formData.append('ImageFile', selectedFile);  }
  formData.append('ProductId', selectedProduct?.productId || '');

  apiService({
    method: "POST",
    url: "https://sacnsommasterdataservice.azurewebsites.net/api/ProductImages",
    data: formData,
  })
    .then((response) => {
      console.log(response.data); // Log the data
      setAlertMessage("Image Uploaded  successfully!");
      setAlertColor("info");
      toggle(); // Close the modal
      setRefreshKey((oldKey) => oldKey + 1); // Trigger a refresh
      setTimeout(() => setAlertMessage(""), 2000); // Clear the alert message after 2 seconds
    })
    .catch((error) => {
      console.error(error);
      setAlertMessage("An error occurred while upload image.");
      setAlertColor("danger");
    });
  
}

function handleUploadImage(productId: string) {
  // Implement your upload image logic here
  console.log(productId);
  setUpdateModal(true);
  setSelectedProduct(
    products.find((product) => product.productId === productId) || null
    
  );

}
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
      fetchCategories();
  }, [refreshKey]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  return (
    <>
      <Card>
        <CardHeader>
          {alertMessage && <Alert color={alertColor}>{alertMessage}</Alert>}
          <Button
            color="primary"
            style={{ float: "right" }}
            onClick={handleCreateNew}
          >
            Create Product
          </Button>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              <Spinner color="info">Loading...</Spinner>
            </div>
          ) : (
            <div>
            <Table>
              <thead>
                <tr>
                  <th>Front Image</th>
                  <th>Back Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Tag</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsOnPage.map((product) => (
                  <tr key={product.productId}>
                    {product.images[0] && (
                      <td>
                        {product.images[0] ? (
                        <img
                          src={product.images[0].imageUrl}
                          alt="Product Back"
                          width="50"
                          height="50"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faImage} />
                      )}
                      </td>
                    )}
                    <td>
                      {product.images[1] ? (
                        <img
                          src={product.images[1].imageUrl}
                          alt="Product Back"
                          width="50"
                          height="50"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faImage} />
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price}</td>
                    <td>{product.tag}</td>
                    <td>
                      <td>
                        <FontAwesomeIcon
                          icon={faEdit}
                          style={{ color: "green", marginRight: "10px" }}
                          onClick={() => handleEdit(product.productId)}
                        />{" "}
                        | &nbsp;
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: "darkred", marginRight: "10px" }}
                          onClick={() => handleDelete(product.productId)}
                        />{" "}
                        | &nbsp;
                        <FontAwesomeIcon
                          icon={faUpload}
                          style={{ color: "purple", marginRight: "10px" }}
                          onClick={() => handleUploadImage(product.productId)}
                        />
                      </td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination>
        <PaginationItem disabled={currentPage <= 0}>
          <PaginationLink previous onClick={() => handlePageClick(currentPage - 1)} />
        </PaginationItem>
        {Array.from({ length: pageCount }, (_, i) => (
          <PaginationItem active={i === currentPage} key={i}>
            <PaginationLink onClick={() => handlePageClick(i)}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem disabled={currentPage >= pageCount - 1}>
          <PaginationLink next onClick={() => handlePageClick(currentPage + 1)} />
        </PaginationItem>
      </Pagination>
          </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={createModal} toggle={() => setCreateModal(!createModal)}>
        <ModalHeader toggle={() => setCreateModal(!createModal)}>
          Create Product
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={product.name}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="category">Category</Label>
              <CustomInput
                type="select"
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </CustomInput>
            </FormGroup>
            <FormGroup>
              <Label for="price">Price</Label>
              <Input
                type="number"
                name="price"
                id="price"
                value={product.price}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="tag">Tag</Label>
              <Input
                type="text"
                name="tag"
                id="tag"
                value={product.tag}
                onChange={handleChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          {isEditMode ? (
            <Button color="primary" onClick={updateProduct}>
              Update
            </Button>
          ) : (
            <Button color="primary" onClick={handleCreate}>
              Add
            </Button>
          )}
          {/* <Button color="primary" onClick={handleCreate}>Create</Button>{' '} */}
          <Button color="secondary" onClick={() => setCreateModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={updateModal} toggle={() => setUpdateModal(!updateModal)}>
        <ModalHeader toggle={() => setUpdateModal(!updateModal)}>
          Update Image
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="productImage">Product Image</Label>
              <Input
                type="file"
                name="file"
                id="productImage"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <FormFeedback>File selected: {selectedFile.name}</FormFeedback>
              )}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() =>
              handleUploadImageServer(selectedProduct?.productId || "")
            }
          >
            Update
          </Button>{" "}
          <Button color="secondary" onClick={() => setUpdateModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};



export default Products;