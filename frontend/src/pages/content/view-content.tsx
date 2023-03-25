// ** MUI Imports
// @ts-nocheck
import {useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import authRoute from 'src/@core/utils/auth-route';
import MUIDataTable from "mui-datatables";

const ViewContent = () => {
  const [content, setContent] = useState([]);

  const columns = [
    {
     name: "id",
     label: "Id",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "name",
     label: "Name",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "description",
     label: "Description",
     options: {
      filter: true,
      sort: false,
     }
    },
    
   ];

  const options = {
    filterType: 'checkbox',
    onRowClick: (rowData, rowState) => {
      console.log(rowData, rowState);
      handleClick(rowData[0]);
    },
  };




  const handleClick = (rowData) => {

    fetch(`http://localhost:8080/api/advertisements/single/${rowData}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      }
      )
      .catch((error) => {
        console.error('Error:', error);
      }
      );
  };


  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      // Token not found, redirect to login page
      window.location.replace('/pages/login');

      return;
    }

    fetch('http://localhost:8080/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // Get account ID from response body
          return response.json();
        } else {
          // Token not valid, redirect to login page
          throw new Error('Invalid token');
        }
      })
      .then((data) => {
        fetch(`http://localhost:8080/api/advertisements/${data}`)
          .then((response) => response.json())
          .then((data) => {
            setContent(data);
          });
      })
      .catch((error) => {
        console.error(error);
        window.location.replace('/pages/login');
      });
  }, []);

  return (
    <MUIDataTable 
    title={"Content List"}
    data={content}
    columns={columns}
    options={options}
  />
  )
}

// @ts-ignore
export default authRoute(ViewContent)
