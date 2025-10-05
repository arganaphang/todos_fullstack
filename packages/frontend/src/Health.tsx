import { useHealth } from "./useHealth";

const Health = () => {
  const health = useHealth();
  if (health.loading) {
    return <p>Loading. . .</p>;
  }
  if (health.error) {
    return (
      <p>
        Error: <pre>{`${health.error}`}</pre>
      </p>
    );
  }
  return (
    <div>
      Health <pre>{JSON.stringify(health.data, null, 2)}</pre>
    </div>
  );
};

export default Health;
