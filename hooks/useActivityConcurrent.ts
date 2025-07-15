import { useQuery } from "@tanstack/react-query";
import {getActivityConcurent} from "@/api";
import { useStoreApp } from "@/store";

const useActivityConcurrent = () => {
    const store = useStoreApp((state) => state);
    const { data, error, isError } = useQuery({
        queryKey: ["activity_concurrent", store?.token],
        queryFn: async () => await getActivityConcurent(store?.token),
    });
    if (error || isError || !data) {
        return {
            value: "",
            selectedList: [],
            list: [],
            error: error?.message,
        };
    }
    return {
        value: "",
        selectedList: [],
        list: data?.length ? data.map((item: any) => ({
            _id: String(item?.id),
            value: String(item?.libelle),
        })): [],
        error: "",
    };
};

export default useActivityConcurrent;
