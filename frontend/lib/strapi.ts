import qs from 'qs';

export const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL || 'http://localhost:1337'

const QUERY_HOME_PAGE = {
    populate: {
        sections: {
        on:{
            "layout.hero-section":{
            populate:{
                image:{
                    fields: ["url", "alternativeText"]
                },
                link:{
                populate: true
                }
            }
            }
        }
        }
    }
}
export async function getHomePage() {
    'use cache';
    const query = qs.stringify(QUERY_HOME_PAGE);
    console.log(`/api/home-page?${query}`);
    const response = await getStrapiData(`/api/home-page?${query}`);
    console.log(response);
    return response?.data;
}
  

export async function getStrapiData(url:string) {
    try{
        const response = await fetch(`${STRAPI_BASE_URL}${url}`);
        console.log(response);
        if(!response.ok){
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function registerUserService(userData:Object) {
    const url = `${STRAPI_BASE_URL}/api/auth/local/register`

    try{
        const response = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(userData)
        })

        const data = await response.json()
        console.log(data)
        return data
    } catch(error){
        console.error('Error registering user:' , error)
        throw error
    }
    
}

export async function loginUserService(userData:Object) {
    const url = `${STRAPI_BASE_URL}/api/auth/local`

    try{
        const response = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(userData)
        })

        const data = await response.json()
        console.log(data)
        return data
    } catch(error){
        console.error('Error login user:' , error)
        throw error
    }
    
}