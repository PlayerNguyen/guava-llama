import { useModelStore } from "@/stores/ModelStore";
import { Select, SelectProps } from "@mantine/core";

/**
 * ModelSelectProps: A type definition for props
 * passed to the ModelSelect component.
 *
 * This type extends the `SelectProps` type, which is
 * assumed to be defined elsewhere in the application,
 * and adds no additional properties. It is used to ensure
 * that only compatible props are accepted by the component.
 */
export type ModelSelectProps = SelectProps & {};

/**
 * ModelSelect Component: A dropdown menu that lists available models.
 *
 * This component utilizes the `useModelStore` hook to fetch the list of available models from the store,
 * and then maps over these models to create an array of names, which is passed as data to a Select component.
 *
 * The Select component accepts props to customize its appearance and behavior.
 */
export default function ModelSelect({ ...props }: ModelSelectProps) {
  const { models } = useModelStore();
  return (
    <Select searchable data={models.map((model) => model.name)} {...props} />
  );
}
