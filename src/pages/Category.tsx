import { apiService } from '@app/services/apiService';
import { ContentHeader } from '@components';
import { useEffect, useState } from 'react';
 
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    Col,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    Row,
    Table,
  } from 'reactstrap';
 

  // Define the data structure
interface Category {
    name: string;
    description: string;
    status: string;
  }
  

const Category = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
     // Fetch data from the API

     useEffect(() => {
        apiService({
          method: 'GET',
          url: 'https://sacnsommasterdataservice.azurewebsites.net/api/Category',
        })
        .then(response => {
          console.log(response.data); // Log the data
          setCategories(response.data.data);
        })
        .catch(error => console.error(error));
      }, []);

  return (
   
    <div>
      <ContentHeader title="Category List" />
      <section className="content">
        <div className="container-fluid">
        
            <Card>
              <CardHeader className='border-transparent'>
                <CardTitle>Category Master</CardTitle>
                <Button
                        color="success"
                        outline
                        security='sm'
                        style={{ float: 'right' }}
                        onClick={toggle}
                        >
    Add New
  </Button>
              </CardHeader>
             
              <CardBody className='p-0'>
                <Table responsive>
                <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category, index) => (
          <tr key={index}>
            <td>{category.name}</td>
            <td>{category.description}</td>
            <td>
            <Badge tag='span' color='success'>
                          Active
                        </Badge>
            </td>
          </tr>
        ))}
      </tbody>
                </Table>
              </CardBody>
            </Card>

         
        </div>
      </section>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
          
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Do Something
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  


  );
};

export default Category;
