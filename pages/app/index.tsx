import { Heading } from "@chakra-ui/core";
import Header from "pages/app/components/Header";
import { useQuery, gql } from "@apollo/client";

const GET_HELLO = gql`
  {
    getHellos {
      id
      message
    }
  }
`;

interface Hello {
  id: string;
  message: string;
}

const Index = () => {
  const { loading, error, data } = useQuery<{ getHellos: Hello[] }>(GET_HELLO);

  return (
    <>
      <Header />
      <Heading>Welcome to the App!</Heading>
      <div>
        {data?.getHellos.map(({ id, message }) => (
          <p key={id}>
            {id} - {message}
          </p>
        ))}
      </div>
    </>
  );
};

export default Index;
