import { Web3Storage } from 'web3.storage'
import { toast } from 'react-hot-toast';

function getAccessToken () {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk5ODI1MGE5N0YzZTE2NGZiRWNCMjFiOUY1Q2NhNWYxMjg2MGI0MDgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzM4ODAxNDYxODAsIm5hbWUiOiJnb2Z1bmRtZSJ9.a3vV_RBJghp9WK0D3SrS9QfcKb4yjRutzJ4AYZHzOTY"
}

function makeStorageClient () {
  return new Web3Storage({ token: getAccessToken() })
}

function getFiles () {
    const fileInput = document.querySelector('input[type="file"]')
    return fileInput.files
}

export default async function storeFiles (file,setUploading) {

    if(file != undefined){
      setUploading(true)
      const client = makeStorageClient()
      const cid = await client.put(file)
      console.log('stored files with cid:', cid)
      setUploading(false)
      
      toast.success("Image uploaded !", {
        style: {
          border: '1px solid #02a95c',
          padding: '16px',
          color: '#02a95c',
          fontFamily:"NunitoRegular"
        },
        iconTheme: {
          primary: '#02a95c',
          secondary: 'white',
        },
      });
      return cid
    }
}