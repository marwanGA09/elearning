import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div>
      {' '}
      <p>protected route </p>
      <p>Hello type</p>
      <Button variant="destructive">HEllo</Button>
    </div>
  );
}
