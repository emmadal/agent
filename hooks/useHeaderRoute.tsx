import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { HeaderBackIcon } from "@/components/navigation/HeaderBackIcon";

const useHeaderRouter = ({ title }: { title: string }) => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontSize: 18,
      },
      headerStyles: {
        height: 50,
        backgroundColor: "#f4511e",
      },
      headerTitle: title,
      headerTitleAlign: "center",
      headerLeft: () => <HeaderBackIcon name="arrow-back-sharp" />,
    });
  }, [navigation, title]);
};

export default useHeaderRouter;
