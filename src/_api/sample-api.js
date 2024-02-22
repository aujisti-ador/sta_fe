import axios from 'utils/axiosdd';


const getAllSampleList = async (pageIndex = 0, pageSize = 10) => {
    try {
        const response = await axios.get(`/sample/search?page=${pageIndex + 1}&pageSize=${pageSize}`);
        console.log("===> sample list", response);
        return response.data;
    } catch (error) {
        console.error("Error fetching sample list:", error);
        // You can choose to handle the error in different ways,
        // for example, by returning a default value, throwing a new error, or logging it.
        throw error; // Re-throwing the error for the calling code to handle if necessary.
    }
}

export { getAllSampleList }