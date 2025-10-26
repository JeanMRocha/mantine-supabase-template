import { Card, Skeleton, Stack } from '@mantine/core';

export default function LoaderSkeleton() {
  return (
    <Card withBorder radius="md" p="md">
      <Stack>
        <Skeleton height={24} />
        <Skeleton height={18} />
        <Skeleton height={18} />
        <Skeleton height={160} mt="sm" />
      </Stack>
    </Card>
  );
}
