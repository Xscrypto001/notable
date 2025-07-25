# Generated by Django 5.0.1 on 2024-08-28 09:17

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='tag',
            unique_together=set(),
        ),
        migrations.AddField(
            model_name='tag',
            name='parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='children', to='application.tag'),
        ),
        migrations.AddField(
            model_name='tag',
            name='synonyms',
            field=models.ManyToManyField(blank=True, related_name='synonym_tags', to='application.tag'),
        ),
        migrations.AlterField(
            model_name='tag',
            name='name',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='tag',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='TagRelationship',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('relationship_type', models.CharField(max_length=255)),
                ('from_tag', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='from_tags', to='application.tag')),
                ('to_tag', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='to_tags', to='application.tag')),
            ],
        ),
        migrations.RemoveField(
            model_name='tag',
            name='created_at',
        ),
    ]
