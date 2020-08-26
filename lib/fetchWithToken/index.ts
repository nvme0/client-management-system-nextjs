export interface GqlProps {
  query: string;
  variables?: string;
}

export const fetchWithToken = async <T extends { [key: string]: any }>(
  url: string,
  token: string,
  { query, variables }: GqlProps
): Promise<{ errors?: []; data: T | null }> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  const { errors, data } = await response.json();
  return { errors, data };
};
