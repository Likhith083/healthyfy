import { Metadata } from 'next';
import { BookOpen, Clock, Heart, Search, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/animations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Health Education - Health Service Portal',
  description: 'Access health articles, tips, and educational resources to improve your well-being.',
};

const categories = [
  { name: 'All', icon: <BookOpen className="h-4 w-4" /> },
  { name: 'Nutrition', icon: <Heart className="h-4 w-4" /> },
  { name: 'Exercise', icon: <TrendingUp className="h-4 w-4" /> },
  { name: 'Mental Health', icon: <Heart className="h-4 w-4" /> },
  { name: 'Preventive Care', icon: <Heart className="h-4 w-4" /> },
];

const articles = [
  {
    title: 'Understanding Blood Pressure',
    description: 'Learn about normal ranges and how to maintain healthy blood pressure levels.',
    category: 'Preventive Care',
    readTime: '5 min read',
    image: 'https://placehold.co/600x400?text=Blood+Pressure',
  },
  {
    title: 'Healthy Eating Habits',
    description: 'Tips for maintaining a balanced diet and proper nutrition for optimal health.',
    category: 'Nutrition',
    readTime: '7 min read',
    image: 'https://placehold.co/600x400?text=Healthy+Food',
  },
  {
    title: 'Exercise for Beginners',
    description: 'A comprehensive guide to starting your fitness journey safely and effectively.',
    category: 'Exercise',
    readTime: '8 min read',
    image: 'https://placehold.co/600x400?text=Exercise',
  },
  {
    title: 'Managing Stress',
    description: 'Effective techniques for managing stress and improving mental well-being.',
    category: 'Mental Health',
    readTime: '6 min read',
    image: 'https://placehold.co/600x400?text=Stress+Management',
  },
];

export default function HealthEducation() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        {/* Header */}
        <section className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Health Education</h1>
          <p className="text-muted-foreground">
            Access health articles, tips, and educational resources to improve your well-being.
          </p>
        </section>

        {/* Search and Categories */}
        <section className="mb-8 animate-slide-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="mb-8 animate-slide-in">
          <h2 className="text-2xl font-bold mb-4">Featured Articles</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {articles.slice(0, 2).map((article, index) => (
              <Card
                key={index}
                className="overflow-hidden hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-video relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-primary">{article.category}</span>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {article.readTime}
                    </span>
                  </div>
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>Read More</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Articles */}
        <section className="animate-slide-in">
          <h2 className="text-2xl font-bold mb-4">All Articles</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <Card
                key={index}
                className="hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-video relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-primary">{article.category}</span>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {article.readTime}
                    </span>
                  </div>
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">Read More</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Health Tips */}
        <section className="mt-12 animate-slide-in">
          <h2 className="text-2xl font-bold mb-4">Daily Health Tips</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              'Stay hydrated by drinking at least 8 glasses of water daily.',
              'Take regular breaks from screen time to protect your eyes.',
              'Practice deep breathing exercises to reduce stress.',
              'Get 7-8 hours of sleep each night for optimal health.',
              'Include fruits and vegetables in every meal.',
              'Take a 30-minute walk daily for better cardiovascular health.',
            ].map((tip, index) => (
              <Card
                key={index}
                className="hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-muted-foreground">{tip}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
} 