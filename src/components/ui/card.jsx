import React from 'react';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    role="article"
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    role="header"
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => {
  if (!children) {
    return null;
  }
  
  return (
    <h3
      ref={ref}
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => {
  if (!children) {
    return null;
  }

  return (
    <p
      ref={ref}
      className={`text-sm text-muted-foreground ${className}`}
      role="contentinfo"
      {...props}
    >
      {children}
    </p>
  );
});
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, children, ...props }, ref) => {
  if (!children) {
    return null;
  }

  return (
    <div 
      ref={ref} 
      className={`p-6 pt-0 ${className}`}
      role="main"
      {...props}
    >
      {children}
    </div>
  );
});
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => {
  if (!children) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={`flex items-center p-6 pt-0 ${className}`}
      role="contentinfo"
      {...props}
    >
      {children}
    </div>
  );
});
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
