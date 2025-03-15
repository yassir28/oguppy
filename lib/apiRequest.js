import toast from "react-hot-toast";

export async function   makePostRequest(setLoading, url, data, resouceName, reset) {
    try {
        setLoading(true);
        const response =await fetch(url, {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(data)
        })
        
        if(response.ok) {
          console.log(response)
          setLoading(false)
          toast.success(`New ${resouceName} created succesfully!"`)
          reset();
        } else {
            setLoading(false);
            toast.error("Something Went Wrong!")
        }
    } catch (error) {
        setLoading(false)
        console.log(error)
    }
  
}